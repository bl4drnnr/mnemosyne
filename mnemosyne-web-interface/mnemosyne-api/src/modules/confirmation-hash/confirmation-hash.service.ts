import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { HashNotFoundException } from '@exceptions/hash-not-found.exception';
import { AccountAlreadyConfirmedException } from '@exceptions/account-already-confirmed.exception';
import { AccountConfirmedDto } from '@dto/account-confirmed.dto';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';
import { UsersService } from '@modules/users.service';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { RecoveryKeysNotSetDto } from '@dto/recovery-keys-not-set.dto';
import { EmailChangedDto } from '@dto/email-changed.dto';
import { AuthService } from '@modules/auth.service';
import { LinkExpiredException } from '@exceptions/link-expired.exception';
import { PreviousPasswordException } from '@exceptions/previous-password.exception';
import { PasswordResetDto } from '@dto/password-reset.dto';
import { TimeService } from '@shared/time.service';
import { EmailService } from '@shared/email.service';
import { CreateConfirmHashInterface } from '@interfaces/create-confirm-hash.interface';
import { GetByHashInterface } from '@interfaces/get-by-hash.interface';
import { LastPassResetHashInterface } from '@interfaces/last-pass-reset-hash.interface';
import { ConfirmAccountInterface } from '@interfaces/confirm-account.interface';
import { ConfirmEmailInterface } from '@interfaces/confirm-email.interface';
import { ConfirmPasswordResetInterface } from '@interfaces/confirm-password-reset.interface';
import { CompanyAccountConfirmedDto } from '@dto/company-account-confirmed.dto';
import { PasswordNotSetDto } from '@dto/password-not-set.dto';
import { UserDataNotSetDto } from '@dto/user-data-not-set.dto';
import { ConfirmCompanyAccInterface } from '@interfaces/confirm-company-acc.interface';
import { CryptographicService } from '@shared/cryptographic.service';

@Injectable()
export class ConfirmationHashService {
  constructor(
    private readonly cryptographicService: CryptographicService,
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
        confirmationType: Confirmation.FORGOT_PASSWORD
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
      where: { confirmationHash, confirmationType: Confirmation.REGISTRATION },
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

  async confirmCompanyAccount({
    payload,
    confirmationHash,
    language,
    trx: transaction
  }: ConfirmCompanyAccInterface) {
    const foundHash = await this.confirmationHashRepository.findOne({
      where: {
        confirmationHash,
        confirmationType: Confirmation.COMPANY_REGISTRATION
      },
      transaction
    });

    if (!foundHash) throw new HashNotFoundException();

    const {
      id: userId,
      password,
      isMfaSet,
      userSettings,
      firstName,
      lastName,
      email
    } = await this.userService.getUserById({
      id: foundHash.userId,
      trx: transaction
    });

    const userDataSet = !!firstName && !!lastName;
    const userProvidedData = !!payload.firstName && !!payload.lastName;
    const passwordSet = !!password;
    const userProvidedPassword = !!payload.password;

    if (!userDataSet && !userProvidedData) return new UserDataNotSetDto();

    if (!userDataSet && userProvidedData) {
      await this.userService.updateUserInfo({
        payload: { firstName: payload.firstName, lastName: payload.lastName },
        userId,
        trx: transaction
      });
    }

    if (!passwordSet && !userProvidedPassword) return new PasswordNotSetDto();

    if (!passwordSet && userProvidedPassword) {
      const hashedPassword = await this.cryptographicService.hashPassword({
        password: payload.password
      });

      await this.userService.updateUser({
        payload: { password: hashedPassword },
        userId
      });
    }

    const isCompanyAccConfirmed = foundHash.confirmed;
    const isRecoverySetUp = userSettings.recoveryKeysFingerprint;

    if (isCompanyAccConfirmed && isMfaSet && isRecoverySetUp)
      throw new AccountAlreadyConfirmedException();

    if (isCompanyAccConfirmed && !isMfaSet) return new MfaNotSetDto();

    if (isCompanyAccConfirmed && !isRecoverySetUp)
      return new RecoveryKeysNotSetDto();

    await this.confirmationHashRepository.update(
      {
        confirmed: true
      },
      { where: { id: foundHash.id }, transaction }
    );

    await this.emailService.sendCompanyRegistrationCompleteEmail({
      userInfo: { firstName, lastName },
      to: email,
      language
    });

    return new CompanyAccountConfirmedDto();
  }

  async confirmEmailChange({
    confirmationHash,
    payload,
    trx
  }: ConfirmEmailInterface) {
    const foundHash = await this.confirmationHashRepository.findOne({
      where: { confirmationHash, confirmationType: Confirmation.EMAIL_CHANGE },
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
      where: {
        confirmationHash: hash,
        confirmationType: Confirmation.FORGOT_PASSWORD
      },
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
      password: currentUserPassword,
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

    const hashedPassword = await this.cryptographicService.hashPassword({
      password
    });

    const isPreviousPassword = await this.cryptographicService.comparePasswords(
      {
        dataToCompare: hashedPassword,
        hash: currentUserPassword
      }
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
