import * as bcryptjs from 'bcryptjs';
import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { HashNotFoundException } from '@exceptions/hash-not-found.exception';
import { AccountAlreadyConfirmedException } from '@exceptions/account-already-confirmed.exception';
import { AccountConfirmedDto } from '@dto/account-confirmed.dto';
import { Transaction } from 'sequelize';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';
import { UsersService } from '@modules/users.service';
import { CONFIRMATION_TYPE } from '@interfaces/confirmation-type.interface';
import { RecoveryKeysNotSetDto } from '@dto/recovery-keys-not-set.dto';
import { ConfirmEmailChangeDto } from '@dto/confirm-email-change.dto';
import { EmailChangedDto } from '@dto/email-changed.dto';
import { AuthService } from '@modules/auth.service';
import { ResetUserPasswordDto } from '@dto/reset-user-password.dto';
import { LinkExpiredException } from '@exceptions/link-expired.exception';
import { PreviousPasswordException } from '@exceptions/previous-password.exception';
import { PasswordResetDto } from '@dto/password-reset.dto';
import { ApiConfigService } from '@shared/config.service';
import { TimeService } from '@shared/time.service';

@Injectable()
export class ConfirmationHashService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly timeService: TimeService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @InjectModel(ConfirmationHash)
    private readonly confirmationHashRepository: typeof ConfirmationHash
  ) {}

  async createConfirmationHash({
    payload,
    trx: transaction
  }: {
    payload: Partial<ConfirmationHash>;
    trx?: Transaction;
  }) {
    await this.confirmationHashRepository.create(
      {
        userId: payload.userId,
        confirmationHash: payload.confirmationHash,
        confirmationType: payload.confirmationType,
        changingEmail: payload.changingEmail
      },
      { transaction }
    );
  }

  async getUserIdByConfirmationHash({
    confirmationHash,
    trx: transaction
  }: {
    confirmationHash: string;
    trx?: Transaction;
  }) {
    const foundHash = await this.confirmationHashRepository.findOne({
      where: { confirmationHash },
      transaction
    });

    if (!foundHash) throw new HashNotFoundException();

    return { userId: foundHash.userId };
  }

  async getUserByConfirmationHash({
    confirmationHash,
    trx: transaction
  }: {
    confirmationHash: string;
    trx?: Transaction;
  }) {
    const foundHash = await this.confirmationHashRepository.findOne({
      where: { confirmationHash },
      transaction
    });

    if (!foundHash) throw new HashNotFoundException();

    return await this.userService.getUserById({
      id: foundHash.userId
    });
  }

  async getUserLastPasswordResetHash({
    userId,
    trx: transaction
  }: {
    userId: string;
    trx?: Transaction;
  }) {
    return this.confirmationHashRepository.findOne({
      where: {
        userId,
        confirmationType: CONFIRMATION_TYPE.FORGOT_PASSWORD
      },
      order: [['created_at', 'DESC']],
      transaction
    });
  }

  async confirmAccount({
    confirmationHash,
    trx: transaction
  }: {
    confirmationHash: string;
    trx?: Transaction;
  }) {
    const foundHash = await this.confirmationHashRepository.findOne({
      where: { confirmationHash },
      transaction
    });

    if (!foundHash) throw new HashNotFoundException();

    const user = await this.userService.getUserById({
      id: foundHash.userId,
      trx: transaction
    });

    const isAccConfirmed = foundHash.confirmed;
    const isMfaSet = user.isMfaSet;
    const isRecoverySetUp = user.userSettings.recoveryKeysFingerprint;

    if (isAccConfirmed && isMfaSet && isRecoverySetUp)
      throw new AccountAlreadyConfirmedException();

    if (isAccConfirmed && !isMfaSet) return new MfaNotSetDto();

    if (isAccConfirmed && !isRecoverySetUp) return new RecoveryKeysNotSetDto();

    await this.confirmationHashRepository.update(
      {
        confirmed: true
      },
      { where: { id: foundHash.id }, transaction }
    );

    return new AccountConfirmedDto();
  }

  async confirmEmailChange({
    confirmationHash,
    payload,
    trx
  }: {
    confirmationHash: string;
    payload: ConfirmEmailChangeDto;
    trx?: Transaction;
  }) {
    const foundHash = await this.confirmationHashRepository.findOne({
      where: { confirmationHash },
      transaction: trx
    });

    if (!foundHash) throw new HashNotFoundException();

    const user = await this.userService.getUserById({
      id: foundHash.userId,
      trx
    });

    try {
      const mfaStatusResponse = await this.authService.checkUserMfaStatus({
        mfaCode: payload.mfaCode,
        phoneCode: payload.phoneCode,
        userSettings: user.userSettings,
        userId: user.id,
        trx
      });

      if (mfaStatusResponse) return mfaStatusResponse;
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }

    await this.userService.verifyUserCredentials({
      email: user.email,
      password: payload.password,
      trx
    });

    await this.userService.updateUser({
      payload: { email: foundHash.changingEmail },
      userId: user.id,
      trx
    });

    await this.confirmationHashRepository.update(
      {
        confirmed: true
      },
      {
        where: { id: foundHash.id },
        transaction: trx
      }
    );

    return new EmailChangedDto();
  }

  async confirmResetUserPassword({
    payload,
    trx
  }: {
    payload: ResetUserPasswordDto;
    trx?: Transaction;
  }) {
    const { password, hash, phoneCode, mfaCode } = payload;

    const forgotPasswordHash = await this.confirmationHashRepository.findOne({
      where: { confirmationHash: hash },
      transaction: trx
    });

    if (forgotPasswordHash && !password) return;
    if (!forgotPasswordHash) throw new HashNotFoundException();

    const isWithinDay = this.timeService.isWithinTimeframe({
      time: forgotPasswordHash.createdAt,
      seconds: 86400
    });

    if (!isWithinDay) throw new LinkExpiredException();

    const user = await this.userService.getUserById({
      id: forgotPasswordHash.userId,
      trx
    });

    try {
      const mfaStatusResponse = await this.authService.checkUserMfaStatus({
        mfaCode,
        phoneCode,
        userSettings: user.userSettings,
        userId: user.id,
        trx
      });

      if (mfaStatusResponse) return mfaStatusResponse;
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }

    const hashedPassword = await bcryptjs.hash(
      password,
      this.configService.hashPasswordRounds
    );

    const isPreviousPassword = await bcryptjs.compare(
      hashedPassword,
      user.password
    );

    if (isPreviousPassword) throw new PreviousPasswordException();

    await this.userService.updateUser({
      payload: { password: hashedPassword },
      userId: user.id,
      trx
    });

    await this.userService.updateUserSettings({
      payload: { passwordChanged: new Date() },
      userId: user.id,
      trx
    });

    await this.confirmationHashRepository.update(
      {
        confirmed: true
      },
      { where: { id: forgotPasswordHash.id }, transaction: trx }
    );

    return new PasswordResetDto();
  }
}
