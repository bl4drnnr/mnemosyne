import * as node2fa from 'node-2fa';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { UsersService } from '@modules/users.service';
import { WrongCodeException } from '@exceptions/wrong-code.exception';
import { MfaSetDto } from '@dto/mfa-set.dto';
import { PhoneService } from '@shared/phone.service';
import { SmsCodeSentDto } from '@dto/sms-code-sent.dto';
import { SmsExpiredException } from '@exceptions/sms-expired.exception';
import { AuthService } from '@modules/auth.service';
import { AccountDeletedDto } from '@dto/account-deleted.dto';
import { DeleteConfirmationRequiredDto } from '@dto/delete-confirmation-required.dto';
import { WrongDeletionConfirmationException } from '@exceptions/wrong-deletion-confirmation.exception';
import { MfaDisabledDto } from '@dto/mfa-disabled.dto';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { TwoFaNotSetException } from '@exceptions/two-fa-not-set.exception';
import { PhoneNotSetException } from '@exceptions/phone-not-set.exception';
import { WrongProvidedPhoneException } from '@exceptions/wrong-provided-phone.exception';
import { TimeService } from '@shared/time.service';
import { PasswordChangedDto } from '@dto/password-changed.dto';
import { PreviousPasswordException } from '@exceptions/previous-password.exception';
import { SmsClearedDto } from '@dto/sms-cleared.dto';
import { EmailAlreadyChangedException } from '@exceptions/email-already-changed.exception';
import { EmailAlreadyTakenException } from '@exceptions/email-already-taken.exception';
import { EmailService } from '@shared/email.service';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { EmailChangeEmailSentDto } from '@dto/email-change-email-sent.dto';
import { PasswordChangedException } from '@exceptions/password-changed.exception';
import { LoginGenerate2faInterface } from '@interfaces/login-generate-2fa.interface';
import { RegistrationGenerate2faInterface } from '@interfaces/registration-generate-2fa.interface';
import { Generate2faInterface } from '@interfaces/generate-2fa.interface';
import { RegistrationVerify2faInterface } from '@interfaces/registration-verify-2fa.interface';
import { LoginVerify2faInterface } from '@interfaces/login-verify-2fa.interface';
import { Verify2faInterface } from '@interfaces/verify-2fa.interface';
import { Disable2faInterface } from '@interfaces/disable-2fa.interface';
import { RegistrationSendSmsInterface } from '@interfaces/registration-send-sms.interface';
import { LoginSendSmsInterface } from '@interfaces/login-send-sms.interface';
import { SendSmsInterface } from '@interfaces/send-sms.interface';
import { HashSendSmsInterface } from '@interfaces/hash-send-sms.interface';
import { GetSmsInterface } from '@interfaces/get-sms.interface';
import { ClearSmsInterface } from '@interfaces/clear-sms.interface';
import { RegistrationVerifyPhoneInterface } from '@interfaces/registration-verify-phone.interface';
import { LoginVerifyPhoneInterface } from '@interfaces/login-verify-phone.interface';
import { VerifyPhoneInterface } from '@interfaces/verify-phone.interface';
import { DisablePhoneInterface } from '@interfaces/disable-phone.interface';
import { DeleteAccountInterface } from '@interfaces/delete-account.interface';
import { ChangePasswordInterface } from '@interfaces/change-password.interface';
import { ChangeEmailInterface } from '@interfaces/change-email.interface';
import { VerifySmsCodeInterface } from '@interfaces/verify-sms-code.interface';
import { VerifyQrCodeInterface } from '@interfaces/verify-qr-code.interface';
import { GenerateQrCodeInterface } from '@interfaces/generate-qr-code.interface';
import { CryptographicService } from '@shared/cryptographic.service';

@Injectable()
export class SecurityService {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService,
    private readonly cryptographicService: CryptographicService,
    private readonly usersService: UsersService,
    private readonly phoneService: PhoneService,
    private readonly authService: AuthService,
    private readonly timeService: TimeService,
    private readonly emailService: EmailService
  ) {}

  async registrationGenerateTwoFaQrCode({
    confirmationHash,
    trx
  }: RegistrationGenerate2faInterface) {
    const { userId } =
      await this.confirmationHashService.getUserIdByConfirmationHash({
        confirmationHash,
        confirmationType: Confirmation.REGISTRATION,
        trx
      });

    const { email } = await this.usersService.getUserById({ id: userId, trx });

    return await this.generateQrCode({ email });
  }

  async loginGenerateTwoFaQrCode({ payload, trx }: LoginGenerate2faInterface) {
    const { email, password } = payload;

    await this.usersService.verifyUserCredentials({
      email,
      password,
      trx
    });

    return await this.generateQrCode({ email });
  }

  async generateTwoFaQrCode({ userId, trx }: Generate2faInterface) {
    const { email } = await this.usersService.getUserById({ id: userId, trx });

    return await this.generateQrCode({ email });
  }

  async registrationVerifyTwoFaQrCode({
    payload,
    confirmationHash,
    trx
  }: RegistrationVerify2faInterface) {
    const { code, twoFaToken } = payload;

    const { userId } =
      await this.confirmationHashService.getUserIdByConfirmationHash({
        confirmationHash,
        confirmationType: Confirmation.REGISTRATION,
        trx
      });

    try {
      return await this.verifyQrCode({
        userId,
        code,
        twoFaToken,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  async loginVerifyTwoFaQrCode({ payload, trx }: LoginVerify2faInterface) {
    const { code, twoFaToken, email, password } = payload;

    const { id: userId } = await this.usersService.verifyUserCredentials({
      email,
      password,
      trx
    });

    try {
      return await this.verifyQrCode({
        userId,
        code,
        twoFaToken,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  async verifyTwoFaQrCode({ payload, userId, trx }: Verify2faInterface) {
    const { code, twoFaToken } = payload;

    try {
      return await this.verifyQrCode({
        userId,
        code,
        twoFaToken,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  async disableTwoFa({ payload, userId, trx }: Disable2faInterface) {
    const { code } = payload;

    const { twoFaToken, phone } =
      await this.usersService.getUserSettingsByUserId({
        userId,
        trx
      });

    if (!twoFaToken) throw new TwoFaNotSetException();
    if (!phone) throw new PhoneNotSetException();

    try {
      await this.verifyQrCode({
        code,
        twoFaToken,
        userId,
        trx
      });
    } catch (e) {
      throw new HttpException(e.response.message, e.status);
    }

    await this.usersService.updateUserSettings({
      payload: { twoFaToken: null },
      userId,
      trx
    });

    return new MfaDisabledDto();
  }

  async registrationSendSmsCode({
    payload,
    confirmationHash,
    trx
  }: RegistrationSendSmsInterface) {
    const { language, phone } = payload;

    const { userId } =
      await this.confirmationHashService.getUserIdByConfirmationHash({
        confirmationHash,
        confirmationType: Confirmation.REGISTRATION,
        trx
      });

    await this.phoneService.verifyAndResendSmsCode({
      language,
      phone,
      userId,
      trx
    });

    return new SmsCodeSentDto();
  }

  async loginSendSmsCode({ payload, trx }: LoginSendSmsInterface) {
    const { email, password, language } = payload;

    const { id: userId, userSettings } =
      await this.usersService.verifyUserCredentials({
        email,
        password,
        trx
      });

    await this.phoneService.verifyAndResendSmsCode({
      phone: userSettings.phone,
      language,
      userId,
      trx
    });

    return new SmsCodeSentDto();
  }

  async sendSmsCode({ payload, userId, trx }: SendSmsInterface) {
    const { language, phone } = payload;

    await this.phoneService.verifyAndResendSmsCode({
      language,
      phone,
      userId,
      trx
    });

    return new SmsCodeSentDto();
  }

  async hashSendSmsCode({
    confirmationHash,
    language,
    trx
  }: HashSendSmsInterface) {
    const {
      user: {
        id: userId,
        userSettings: { phone }
      }
    } = await this.confirmationHashService.getUserByConfirmationHash({
      confirmationHash,
      trx
    });

    await this.phoneService.verifyAndResendSmsCode({
      phone,
      userId,
      language,
      trx
    });

    return new SmsCodeSentDto();
  }

  async getSmsCode({ userId, language, trx }: GetSmsInterface) {
    const {
      userSettings: { phone }
    } = await this.usersService.getUserById({
      id: userId,
      trx
    });

    if (!phone) throw new PhoneNotSetException();

    await this.phoneService.verifyAndResendSmsCode({
      phone,
      language,
      userId,
      trx
    });

    return new SmsCodeSentDto();
  }

  async clearSmsCode({ userId, trx }: ClearSmsInterface) {
    const {
      userSettings: { phone }
    } = await this.usersService.getUserById({
      id: userId,
      trx
    });

    if (!phone) throw new PhoneNotSetException();

    await this.usersService.updateUserSettings({
      payload: {
        phoneCode: null,
        codeSentAt: null
      },
      userId,
      trx
    });

    return new SmsClearedDto();
  }

  async registrationVerifyMobilePhone({
    payload,
    confirmationHash,
    trx
  }: RegistrationVerifyPhoneInterface) {
    const { phone: providedPhone, code: providedCode } = payload;

    const { userId } =
      await this.confirmationHashService.getUserIdByConfirmationHash({
        confirmationHash,
        confirmationType: Confirmation.REGISTRATION,
        trx
      });

    try {
      return await this.verifySmsCode({
        providedPhone,
        providedCode,
        userId,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  async loginVerifyMobilePhone({ payload, trx }: LoginVerifyPhoneInterface) {
    const {
      email,
      password,
      phone: providedPhone,
      code: providedCode
    } = payload;

    const { id: userId } = await this.usersService.verifyUserCredentials({
      email,
      password,
      trx
    });

    try {
      return await this.verifySmsCode({
        providedPhone,
        providedCode,
        userId,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  async verifyMobilePhone({ payload, userId, trx }: VerifyPhoneInterface) {
    const { phone: providedPhone, code: providedCode } = payload;

    try {
      return await this.verifySmsCode({
        providedPhone,
        providedCode,
        userId,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  async disablePhone({ payload, userId, trx }: DisablePhoneInterface) {
    const { code: providedCode } = payload;

    const { phone: providedPhone, twoFaToken } =
      await this.usersService.getUserSettingsByUserId({
        userId,
        trx
      });

    if (!providedPhone) throw new PhoneNotSetException();
    if (!twoFaToken) throw new TwoFaNotSetException();

    try {
      await this.verifySmsCode({
        providedPhone,
        providedCode,
        userId,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }

    await this.usersService.updateUserSettings({
      payload: { phone: null, phoneCode: null, codeSentAt: null },
      userId,
      trx
    });

    return new MfaDisabledDto();
  }

  async deleteUserAccount({ userId, payload, trx }: DeleteAccountInterface) {
    const { password, phoneCode, mfaCode, fullName } = payload;

    const {
      password: currentUserPassword,
      userSettings,
      firstName,
      lastName
    } = await this.usersService.getUserById({
      id: userId,
      trx
    });

    const passwordEquals = await this.cryptographicService.comparePasswords({
      dataToCompare: password,
      hash: currentUserPassword
    });
    if (!passwordEquals) throw new WrongCredentialsException();

    try {
      const mfaStatusResponse = await this.authService.checkUserMfaStatus({
        mfaCode,
        phoneCode,
        userSettings,
        userId,
        trx
      });

      if (mfaStatusResponse) return mfaStatusResponse;
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }

    if (!fullName) return new DeleteConfirmationRequiredDto();

    if (fullName !== `${firstName} ${lastName}`)
      throw new WrongDeletionConfirmationException();

    await this.usersService.deleteUserAccount({ userId, trx });

    return new AccountDeletedDto();
  }

  async changePassword({ userId, payload, trx }: ChangePasswordInterface) {
    const { currentPassword, newPassword, phoneCode, mfaCode } = payload;

    const { password, userSettings } = await this.usersService.getUserById({
      id: userId,
      trx
    });

    const isWithinDay = this.timeService.isWithinTimeframe({
      time: userSettings.passwordChanged,
      seconds: 86400
    });

    if (isWithinDay) throw new PasswordChangedException();

    const passwordEquals = await this.cryptographicService.comparePasswords({
      dataToCompare: currentPassword,
      hash: password
    });

    if (!passwordEquals) throw new WrongCredentialsException();

    const samePassword = await this.cryptographicService.comparePasswords({
      dataToCompare: newPassword,
      hash: password
    });

    if (samePassword) throw new PreviousPasswordException();

    try {
      const mfaStatusResponse = await this.authService.checkUserMfaStatus({
        mfaCode,
        phoneCode,
        userSettings,
        userId,
        trx
      });

      if (mfaStatusResponse) return mfaStatusResponse;
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }

    const hashedPassword = await this.cryptographicService.hashPassword({
      password: newPassword
    });

    await this.usersService.updateUser({
      payload: { password: hashedPassword },
      userId,
      trx
    });

    return new PasswordChangedDto();
  }

  async changeEmail({ userId, payload, trx }: ChangeEmailInterface) {
    const { newEmail, language } = payload;

    const {
      firstName,
      lastName,
      userSettings: { emailChanged }
    } = await this.usersService.getUserById({
      id: userId,
      trx
    });

    if (emailChanged) throw new EmailAlreadyChangedException();

    const existingUser = await this.usersService.getUserByEmail({
      email: newEmail,
      trx
    });

    if (existingUser) throw new EmailAlreadyTakenException();

    const confirmationHash =
      this.cryptographicService.generateConfirmationHash();

    await this.emailService.sendEmailChangeEmail({
      payload: {
        to: newEmail,
        changingEmail: newEmail,
        confirmationType: Confirmation.EMAIL_CHANGE,
        confirmationHash,
        userId
      },
      userInfo: { firstName, lastName },
      language,
      trx
    });

    return new EmailChangeEmailSentDto();
  }

  private async verifySmsCode({
    providedPhone,
    providedCode,
    userId,
    trx
  }: VerifySmsCodeInterface) {
    const { codeSentAt, phoneCode, phone } =
      await this.usersService.getUserSettingsByUserId({ userId, trx });

    if (phone !== providedPhone) throw new WrongProvidedPhoneException();

    if (phoneCode !== providedCode) throw new WrongCodeException();

    const isWithinFiveMinutes = this.timeService.isWithinTimeframe({
      time: codeSentAt,
      seconds: 300
    });

    if (phoneCode === providedCode && !isWithinFiveMinutes)
      throw new SmsExpiredException();

    await this.usersService.updateUser({
      payload: { isMfaSet: true },
      userId,
      trx
    });

    await this.clearSmsCode({ userId, trx });

    return new MfaSetDto();
  }

  private async generateQrCode({ email }: GenerateQrCodeInterface) {
    const { qr, secret } = node2fa.generateSecret({
      name: 'Mnemosyne',
      account: email
    });

    return { qr, secret };
  }

  private async verifyQrCode({
    userId,
    code,
    twoFaToken,
    trx
  }: VerifyQrCodeInterface) {
    const delta = node2fa.verifyToken(twoFaToken, code);

    if (!delta || (delta && delta.delta !== 0)) throw new WrongCodeException();

    await this.usersService.updateUser({
      payload: { isMfaSet: true },
      userId,
      trx
    });

    await this.usersService.updateUserSettings({
      payload: { twoFaToken },
      userId,
      trx
    });

    return new MfaSetDto();
  }
}
