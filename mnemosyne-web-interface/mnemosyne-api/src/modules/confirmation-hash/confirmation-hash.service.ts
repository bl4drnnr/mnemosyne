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
import { ConfirmCompanyAccInterface } from '@interfaces/confirm-company-acc.interface';
import { CryptographicService } from '@shared/cryptographic.service';
import { CompanyService } from '@modules/company.service';
import { ConfirmHashInterface } from '@interfaces/confirm-hash.interface';
import { GetHashByUserIdInterface } from '@interfaces/get-hash-by-user-id.interface';

@Injectable()
export class ConfirmationHashService {
  constructor(
    private readonly cryptographicService: CryptographicService,
    private readonly timeService: TimeService,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
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
      rejectOnEmpty: undefined,
      where: { confirmationHash },
      transaction
    });

    if (!foundHash) throw new HashNotFoundException();

    return { userId: foundHash.userId };
  }

  async getUserByConfirmationHash({
    confirmationHash,
    confirmationType,
    trx: transaction
  }: GetByHashInterface) {
    const where: Partial<ConfirmationHash> = { confirmationHash };

    if (confirmationType) where.confirmationHash = confirmationHash;

    const foundHash = await this.confirmationHashRepository.findOne({
      where,
      transaction
    });

    if (!foundHash) throw new HashNotFoundException();

    const user = await this.usersService.getUserById({
      id: foundHash.userId
    });

    return { foundHash, user };
  }

  async getConfirmationHashByUserId({
    userId,
    confirmationType,
    trx: transaction
  }: GetHashByUserIdInterface) {
    return await this.confirmationHashRepository.findOne({
      rejectOnEmpty: undefined,
      where: { userId, confirmationType },
      transaction
    });
  }

  async getUserLastPasswordResetHash({
    userId,
    trx: transaction
  }: LastPassResetHashInterface) {
    return this.confirmationHashRepository.findOne({
      rejectOnEmpty: undefined,
      where: {
        userId,
        confirmationType: Confirmation.FORGOT_PASSWORD
      },
      order: [['created_at', 'DESC']],
      transaction
    });
  }

  async confirmHash({ hashId: id, trx: transaction }: ConfirmHashInterface) {
    await this.confirmationHashRepository.update(
      {
        confirmed: true
      },
      { returning: false, where: { id }, transaction }
    );
  }

  async confirmAccount({
    confirmationHash,
    language,
    trx
  }: ConfirmAccountInterface) {
    const { user, foundHash } = await this.getUserByConfirmationHash({
      confirmationHash,
      confirmationType: Confirmation.REGISTRATION,
      trx
    });

    const { isMfaSet, userSettings, firstName, lastName, email } = user;

    const isAccConfirmed = foundHash.confirmed;
    const isRecoverySetUp = userSettings.recoveryKeysFingerprint;

    if (isAccConfirmed && isMfaSet && isRecoverySetUp)
      throw new AccountAlreadyConfirmedException();

    if (isAccConfirmed && !isMfaSet) return new MfaNotSetDto();

    if (isAccConfirmed && !isRecoverySetUp) return new RecoveryKeysNotSetDto();

    await this.confirmHash({
      hashId: foundHash.id,
      trx
    });

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
    trx
  }: ConfirmCompanyAccInterface) {
    const { foundHash: hash, user } = await this.getUserByConfirmationHash({
      confirmationHash,
      confirmationType: Confirmation.COMPANY_REGISTRATION,
      trx
    });

    const { userSettings, isMfaSet } = user;

    const isRecoverySet = userSettings.recoveryKeysFingerprint;

    const isCompanyAccConfirmed = hash.confirmed && isMfaSet && isRecoverySet;

    if (!isCompanyAccConfirmed) {
      return await this.usersService.createAccountFromScratch({
        user,
        hash,
        payload,
        trx
      });
    } else {
      return await this.companyService.confirmCompanyCreation({
        userId: user.id,
        language: payload.language,
        trx
      });
    }
  }

  async companyMemberAccountConfirmation({
    payload,
    confirmationHash,
    trx
  }: ConfirmCompanyAccInterface) {
    const { foundHash: hash, user } = await this.getUserByConfirmationHash({
      confirmationHash,
      confirmationType: Confirmation.COMPANY_INVITATION,
      trx
    });

    const { userSettings, isMfaSet } = user;

    const isRecoverySet = userSettings.recoveryKeysFingerprint;

    const isCompanyAccConfirmed = hash.confirmed && isMfaSet && isRecoverySet;

    if (!isCompanyAccConfirmed) {
      return await this.usersService.createAccountFromScratch({
        user,
        hash,
        payload,
        trx
      });
    } else {
      return await this.companyService.confirmCompanyMembership({
        language: payload.language,
        userId: user.id,
        trx
      });
    }
  }

  async confirmEmailChange({
    confirmationHash,
    payload,
    trx
  }: ConfirmEmailInterface) {
    const { foundHash, user } = await this.getUserByConfirmationHash({
      confirmationHash,
      confirmationType: Confirmation.EMAIL_CHANGE,
      trx
    });

    const { id: userId, userSettings, email, firstName, lastName } = user;

    const isWithinDay = this.timeService.isWithinTimeframe({
      time: foundHash.createdAt,
      seconds: 86400
    });

    if (!isWithinDay) throw new LinkExpiredException();

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

    await this.usersService.verifyUserCredentials({
      email,
      password,
      trx
    });

    await this.usersService.updateUser({
      payload: { email: foundHash.changingEmail },
      userId,
      trx
    });

    await this.usersService.updateUserSettings({
      payload: { emailChanged: true },
      userId,
      trx
    });

    await this.emailService.sendEmailChangeCompleteEmail({
      userInfo: { firstName, lastName },
      to: email,
      language
    });

    await this.confirmHash({
      hashId: foundHash.id,
      trx
    });

    return new EmailChangedDto();
  }

  async confirmResetUserPassword({
    hash,
    payload,
    trx
  }: ConfirmPasswordResetInterface) {
    const { password, phoneCode, mfaCode, language } = payload;

    const { foundHash: forgotPasswordHash, user } =
      await this.getUserByConfirmationHash({
        confirmationHash: hash,
        confirmationType: Confirmation.FORGOT_PASSWORD,
        trx
      });

    if (!forgotPasswordHash) throw new HashNotFoundException();

    const {
      id: userId,
      userSettings,
      password: currentUserPassword,
      email,
      firstName,
      lastName
    } = user;

    const isWithinDay = this.timeService.isWithinTimeframe({
      time: forgotPasswordHash.createdAt,
      seconds: 86400
    });

    if (!isWithinDay) throw new LinkExpiredException();

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

    await this.usersService.updateUser({
      payload: { password: hashedPassword },
      userId,
      trx
    });

    await this.usersService.updateUserSettings({
      payload: { passwordChanged: new Date() },
      userId,
      trx
    });

    await this.emailService.sendResetPasswordCompleteEmail({
      userInfo: { firstName, lastName },
      to: email,
      language
    });

    await this.confirmHash({
      hashId: forgotPasswordHash.id,
      trx
    });

    return new PasswordResetDto();
  }
}
