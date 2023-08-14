import * as bcryptjs from 'bcryptjs';
import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { HashNotFoundException } from '@exceptions/hash-not-found.exception';
import { AccountAlreadyConfirmedException } from '@exceptions/account-already-confirmed.exception';
import { AccountConfirmedDto } from '@dto/account-confirmed.dto';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';
import { UsersService } from '@modules/users.service';
import { ConfirmationEnum } from '@interfaces/confirmation-type.enum';
import { RecoveryKeysNotSetDto } from '@dto/recovery-keys-not-set.dto';
import { EmailChangedDto } from '@dto/email-changed.dto';
import { AuthService } from '@modules/auth.service';
import { LinkExpiredException } from '@exceptions/link-expired.exception';
import { PreviousPasswordException } from '@exceptions/previous-password.exception';
import { PasswordResetDto } from '@dto/password-reset.dto';
import { ApiConfigService } from '@shared/config.service';
import { TimeService } from '@shared/time.service';
import { EmailService } from '@shared/email.service';
import { CreateConfirmHashInterface } from '@interfaces/create-confirm-hash.interface';
import { GetByHashInterface } from '@interfaces/get-by-hash.interface';
import { LastPassResetHashInterface } from '@interfaces/last-pass-reset-hash.interface';
import { ConfirmAccountInterface } from '@interfaces/confirm-account.interface';
import { ConfirmEmailInterface } from '@interfaces/confirm-email.interface';
import { ConfirmPasswordResetInterface } from '@interfaces/confirm-password-reset.interface';

@Injectable()
export class ConfirmationHashService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly timeService: TimeService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
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
  }: CreateConfirmHashInterface) {
    const { userId, confirmationType, confirmationHash, changingEmail } =
      payload;

    await this.confirmationHashRepository.create(
      {
        userId,
        confirmationHash,
        confirmationType,
        changingEmail
      },
      { transaction }
    );
  }

  async getUserIdByConfirmationHash({
    confirmationHash,
    trx: transaction
  }: GetByHashInterface) {
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
  }: GetByHashInterface) {
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
  }: LastPassResetHashInterface) {
    return this.confirmationHashRepository.findOne({
      where: {
        userId,
        confirmationType: ConfirmationEnum.FORGOT_PASSWORD
      },
      order: [['created_at', 'DESC']],
      transaction
    });
  }

  async confirmAccount({
    confirmationHash,
    language,
    trx: transaction
  }: ConfirmAccountInterface) {
    const foundHash = await this.confirmationHashRepository.findOne({
      where: { confirmationHash },
      transaction
    });

    if (!foundHash) throw new HashNotFoundException();

    const { isMfaSet, userSettings, firstName, lastName, email } =
      await this.userService.getUserById({
        id: foundHash.userId,
        trx: transaction
      });

    const isAccConfirmed = foundHash.confirmed;
    const isRecoverySetUp = userSettings.recoveryKeysFingerprint;

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

    await this.emailService.sendRegistrationCompleteEmail({
      userInfo: { firstName, lastName },
      to: email,
      language
    });

    return new AccountConfirmedDto();
  }

  async confirmEmailChange({
    confirmationHash,
    payload,
    trx
  }: ConfirmEmailInterface) {
    const foundHash = await this.confirmationHashRepository.findOne({
      where: { confirmationHash },
      transaction: trx
    });

    if (!foundHash) throw new HashNotFoundException();

    const isWithinDay = this.timeService.isWithinTimeframe({
      time: foundHash.createdAt,
      seconds: 86400
    });

    if (!isWithinDay) throw new LinkExpiredException();

    const {
      id: userId,
      userSettings,
      email,
      firstName,
      lastName
    } = await this.userService.getUserById({
      id: foundHash.userId,
      trx
    });

    const { mfaCode, phoneCode, password, language } = payload;

    try {
      const mfaStatusResponse = await this.authService.checkUserMfaStatus({
        userSettings,
        userId,
        mfaCode,
        phoneCode,
        language,
        trx
      });

      if (mfaStatusResponse) return mfaStatusResponse;
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }

    await this.userService.verifyUserCredentials({
      email,
      password,
      trx
    });

    await this.userService.updateUser({
      payload: { email: foundHash.changingEmail },
      userId,
      trx
    });

    await this.userService.updateUserSettings({
      payload: { emailChanged: true },
      userId,
      trx
    });

    await this.emailService.sendEmailChangeCompleteEmail({
      userInfo: { firstName, lastName },
      to: email,
      language
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
  }: ConfirmPasswordResetInterface) {
    const { password, hash, phoneCode, mfaCode, language } = payload;

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

    const {
      id: userId,
      userSettings,
      password: userPassword,
      email,
      firstName,
      lastName
    } = await this.userService.getUserById({
      id: forgotPasswordHash.userId,
      trx
    });

    try {
      const mfaStatusResponse = await this.authService.checkUserMfaStatus({
        mfaCode,
        phoneCode,
        userSettings,
        userId,
        language,
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
      userPassword
    );

    if (isPreviousPassword) throw new PreviousPasswordException();

    await this.userService.updateUser({
      payload: { password: hashedPassword },
      userId,
      trx
    });

    await this.userService.updateUserSettings({
      payload: { passwordChanged: new Date() },
      userId,
      trx
    });

    await this.emailService.sendResetPasswordCompleteEmail({
      userInfo: { firstName, lastName },
      to: email,
      language
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
