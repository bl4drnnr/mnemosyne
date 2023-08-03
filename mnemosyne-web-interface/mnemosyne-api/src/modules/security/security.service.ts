import * as node2fa from 'node-2fa';
import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { UsersService } from '@modules/users.service';
import { VerifyTwoFaDto } from '@dto/verify-two-fa.dto';
import { WrongCodeException } from '@exceptions/wrong-code.exception';
import { MfaSetDto } from '@dto/mfa-set.dto';
import { RegistrationSendSmsCodeDto } from '@dto/registration-send-sms-code.dto';
import { PhoneService } from '@shared/phone.service';
import { VerifyMobilePhoneDto } from '@dto/verify-mobile-phone.dto';
import { SmsCodeSentDto } from '@dto/sms-code-sent.dto';
import { SmsExpiredException } from '@exceptions/sms-expired.exception';
import { LoginSendSmsDto } from '@dto/login-send-sms.dto';
import { Transaction } from 'sequelize';
import { DeleteAccountDto } from '@dto/delete-account.dto';
import { AuthService } from '@modules/auth.service';
import { AccountDeletedDto } from '@dto/account-deleted.dto';
import { DeleteConfirmationRequiredDto } from '@dto/delete-confirmation-required.dto';
import { WrongDeletionConfirmationException } from '@exceptions/wrong-deletion-confirmation.exception';
import { DisableTwoFaDto } from '@dto/disable-two-fa.dto';
import { MfaDisabledDto } from '@dto/mfa-disabled.dto';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { TwoFaNotSetException } from '@exceptions/two-fa-not-set.exception';
import { PhoneNotSetException } from '@exceptions/phone-not-set.exception';
import { WrongProvidedPhoneException } from '@exceptions/wrong-provided-phone.exception';
import { LoginGenerate2faQrDto } from '@dto/login-generate-2fa-qr.dto';
import { TimeService } from '@shared/time.service';
import { ChangePasswordDto } from '@dto/change-password.dto';
import { PasswordChangedDto } from '@dto/password-changed.dto';
import { PreviousPasswordException } from '@exceptions/previous-password.exception';
import { ApiConfigService } from '@shared/config.service';
import { SmsClearedDto } from '@dto/sms-cleared.dto';
import { ChangeEmailDto } from '@dto/change-email.dto';
import { EmailAlreadyChangedException } from '@exceptions/email-already-changed.exception';
import { EmailAlreadyTakenException } from '@exceptions/email-already-taken.exception';
import { EmailService } from '@shared/email.service';
import { CONFIRMATION_TYPE } from '@interfaces/confirmation-type.interface';
import { EmailChangeEmailSentDto } from '@dto/email-change-email-sent.dto';
import { PasswordChangedException } from '@exceptions/password-changed.exception';
import { LANGUAGE_TYPES } from '@interfaces/language.types';

@Injectable()
export class SecurityService {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService,
    private readonly configService: ApiConfigService,
    private readonly userService: UsersService,
    private readonly phoneService: PhoneService,
    private readonly authService: AuthService,
    private readonly timeService: TimeService,
    private readonly emailService: EmailService
  ) {}

  async registrationGenerateTwoFaQrCode({
    confirmationHash,
    trx
  }: {
    confirmationHash: string;
    trx?: Transaction;
  }) {
    const { userId } =
      await this.confirmationHashService.getUserIdByConfirmationHash({
        confirmationHash,
        trx
      });

    const { email } = await this.userService.getUserById({ id: userId, trx });

    return await this.generateQrCode({ email });
  }

  async loginGenerateTwoFaQrCode({
    payload,
    trx
  }: {
    payload: LoginGenerate2faQrDto;
    trx?: Transaction;
  }) {
    const { email, password } = payload;

    await this.userService.verifyUserCredentials({
      email,
      password,
      trx
    });

    return await this.generateQrCode({ email });
  }

  async generateTwoFaQrCode({
    userId,
    trx
  }: {
    userId: string;
    trx?: Transaction;
  }) {
    const { email } = await this.userService.getUserById({ id: userId, trx });

    return await this.generateQrCode({ email });
  }

  async registrationVerifyTwoFaQrCode({
    payload,
    confirmationHash,
    trx
  }: {
    payload: VerifyTwoFaDto;
    confirmationHash: string;
    trx?: Transaction;
  }) {
    const { code, twoFaToken } = payload;

    const { userId } =
      await this.confirmationHashService.getUserIdByConfirmationHash({
        confirmationHash,
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

  async loginVerifyTwoFaQrCode({
    payload,
    trx
  }: {
    payload: VerifyTwoFaDto;
    trx?: Transaction;
  }) {
    const { code, twoFaToken, email, password } = payload;

    const { id: userId } = await this.userService.verifyUserCredentials({
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

  async verifyTwoFaQrCode({
    payload,
    userId,
    trx
  }: {
    payload: VerifyTwoFaDto;
    userId: string;
    trx?: Transaction;
  }) {
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

  async disableTwoFa({
    payload,
    userId,
    trx
  }: {
    payload: DisableTwoFaDto;
    userId: string;
    trx?: Transaction;
  }) {
    const { code } = payload;

    const { twoFaToken, phone } =
      await this.userService.getUserSettingsByUserId({
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

    await this.userService.updateUserSettings({
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
  }: {
    payload: RegistrationSendSmsCodeDto;
    confirmationHash: string;
    trx?: Transaction;
  }) {
    const { language, phone } = payload;

    const { userId } =
      await this.confirmationHashService.getUserIdByConfirmationHash({
        confirmationHash,
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

  async loginSendSmsCode({
    payload,
    trx
  }: {
    payload: LoginSendSmsDto;
    trx?: Transaction;
  }) {
    const { email, password, language } = payload;

    const { id: userId, userSettings } =
      await this.userService.verifyUserCredentials({
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

  async sendSmsCode({
    payload,
    userId,
    trx
  }: {
    payload: RegistrationSendSmsCodeDto;
    userId: string;
    trx?: Transaction;
  }) {
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
  }: {
    confirmationHash: string;
    language?: LANGUAGE_TYPES;
    trx?: Transaction;
  }) {
    const {
      id: userId,
      userSettings: { phone }
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

  async getSmsCode({
    userId,
    language,
    trx
  }: {
    userId: string;
    language?: LANGUAGE_TYPES;
    trx?: Transaction;
  }) {
    const {
      userSettings: { phone }
    } = await this.userService.getUserById({
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

  async clearSmsCode({ userId, trx }: { userId: string; trx?: Transaction }) {
    const {
      userSettings: { phone }
    } = await this.userService.getUserById({
      id: userId,
      trx
    });

    if (!phone) throw new PhoneNotSetException();

    await this.userService.updateUserSettings({
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
  }: {
    payload: VerifyMobilePhoneDto;
    confirmationHash: string;
    trx?: Transaction;
  }) {
    const { phone: providedPhone, code: providedCode } = payload;

    const { userId } =
      await this.confirmationHashService.getUserIdByConfirmationHash({
        confirmationHash,
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

  async loginVerifyMobilePhone({
    payload,
    trx
  }: {
    payload: VerifyMobilePhoneDto;
    trx?: Transaction;
  }) {
    const {
      email,
      password,
      phone: providedPhone,
      code: providedCode
    } = payload;

    const { id: userId } = await this.userService.verifyUserCredentials({
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

  async verifyMobilePhone({
    payload,
    userId,
    trx
  }: {
    payload: VerifyMobilePhoneDto;
    userId: string;
    trx?: Transaction;
  }) {
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

  async disablePhone({
    payload,
    userId,
    trx
  }: {
    payload: DisableTwoFaDto;
    userId: string;
    trx?: Transaction;
  }) {
    const { code: providedCode } = payload;

    const { phone: providedPhone, twoFaToken } =
      await this.userService.getUserSettingsByUserId({
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

    await this.userService.updateUserSettings({
      payload: { phone: null, phoneCode: null, codeSentAt: null },
      userId,
      trx
    });

    return new MfaDisabledDto();
  }

  async deleteUserAccount({
    userId,
    payload,
    trx
  }: {
    userId: string;
    payload: DeleteAccountDto;
    trx?: Transaction;
  }) {
    const { password, phoneCode, mfaCode, fullName } = payload;

    const {
      password: userPassword,
      userSettings,
      firstName,
      lastName
    } = await this.userService.getUserById({
      id: userId,
      trx
    });

    const passwordEquals = await bcryptjs.compare(password, userPassword);
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

    await this.userService.deleteUserAccount({ userId, trx });

    return new AccountDeletedDto();
  }

  async changePassword({
    userId,
    payload,
    trx
  }: {
    userId: string;
    payload: ChangePasswordDto;
    trx?: Transaction;
  }) {
    const { currentPassword, newPassword, phoneCode, mfaCode } = payload;

    const { password, userSettings } = await this.userService.getUserById({
      id: userId,
      trx
    });

    const isWithinDay = this.timeService.isWithinTimeframe({
      time: userSettings.passwordChanged,
      seconds: 86400
    });

    if (isWithinDay) throw new PasswordChangedException();

    const passwordEquals = await bcryptjs.compare(currentPassword, password);

    if (!passwordEquals) throw new WrongCredentialsException();

    const samePassword = await bcryptjs.compare(newPassword, password);

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

    const hashedPassword = await bcryptjs.hash(
      newPassword,
      this.configService.hashPasswordRounds
    );

    await this.userService.updateUser({
      payload: { password: hashedPassword },
      userId,
      trx
    });

    return new PasswordChangedDto();
  }

  async changeEmail({
    userId,
    payload,
    trx
  }: {
    userId: string;
    payload: ChangeEmailDto;
    trx?: Transaction;
  }) {
    const { newEmail, language } = payload;

    const {
      firstName,
      lastName,
      userSettings: { emailChanged }
    } = await this.userService.getUserById({
      id: userId,
      trx
    });

    if (emailChanged) throw new EmailAlreadyChangedException();

    const existingUser = await this.userService.getUserByEmail({
      email: newEmail,
      trx
    });

    if (existingUser) throw new EmailAlreadyTakenException();

    const confirmationHash = crypto.randomBytes(20).toString('hex');

    await this.emailService.sendEmailChangeEmail({
      payload: {
        changingEmail: newEmail,
        confirmationType: CONFIRMATION_TYPE.EMAIL_CHANGE,
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
  }: {
    providedPhone: string;
    providedCode: string;
    userId: string;
    trx?: Transaction;
  }) {
    const { codeSentAt, phoneCode, phone } =
      await this.userService.getUserSettingsByUserId({ userId, trx });

    if (phone !== providedPhone) throw new WrongProvidedPhoneException();

    if (phoneCode !== providedCode) throw new WrongCodeException();

    const isWithinFiveMinutes = this.timeService.isWithinTimeframe({
      time: codeSentAt,
      seconds: 300
    });

    if (phoneCode === providedCode && !isWithinFiveMinutes)
      throw new SmsExpiredException();

    await this.userService.updateUser({
      payload: { isMfaSet: true },
      userId,
      trx
    });

    await this.clearSmsCode({ userId, trx });

    return new MfaSetDto();
  }

  private async generateQrCode({ email }: { email: string }) {
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
  }: {
    userId: string;
    code: string;
    twoFaToken: string;
    trx?: Transaction;
  }) {
    const delta = node2fa.verifyToken(twoFaToken, code);

    if (!delta || (delta && delta.delta !== 0)) throw new WrongCodeException();

    await this.userService.updateUser({
      payload: { isMfaSet: true },
      userId,
      trx
    });

    await this.userService.updateUserSettings({
      payload: { twoFaToken },
      userId,
      trx
    });

    return new MfaSetDto();
  }
}
