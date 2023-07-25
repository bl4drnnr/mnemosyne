import * as node2fa from 'node-2fa';
import * as bcryptjs from 'bcryptjs';
import * as dayjs from 'dayjs';
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
import { MfaLoginDto } from '@dto/mfa-login.dto';
import { Transaction } from 'sequelize';
import { DeleteAccountDto } from '@dto/delete-account.dto';
import { AuthService } from '@modules/auth.service';
import { AccountDeletedDto } from '@dto/account-deleted.dto';
import { DeleteConfirmationRequiredDto } from '@dto/delete-confirmation-required.dto';
import { WrongDeletionConfirmationException } from '@exceptions/wrong-deletion-confirmation.exception';
import { DisableTwoFaDto } from '@dto/disable-two-fa.dto';
import { MfaDisabledDto } from '@dto/mfa-disabled.dto';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { TwoFaNotSetUpException } from '@exceptions/two-fa-not-set-up.exception';
import { PhoneNotSetUpException } from '@exceptions/phone-not-set-up.exception';
import { WrongProvidedPhoneException } from '@exceptions/wrong-provided-phone.exception';
import { WrongMfaTokenException } from '@exceptions/wrong-mfa-token.exception';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';

@Injectable()
export class SecurityService {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService,
    private readonly userService: UsersService,
    private readonly phoneService: PhoneService,
    private readonly authService: AuthService
  ) {}

  async registrationGenerateTwoFaQrCode({
    confirmationHash,
    trx
  }: {
    confirmationHash: string;
    trx?: Transaction;
  }) {
    const { userId } =
      await this.confirmationHashService.getUserByConfirmationHash({
        confirmationHash,
        trx
      });

    const user = await this.userService.getUserById({ id: userId, trx });

    return await this.generateQrCode({
      email: user.email,
      userId: user.id,
      trx
    });
  }

  async loginGenerateTwoFaQrCode({
    payload,
    trx
  }: {
    payload: MfaLoginDto;
    trx?: Transaction;
  }) {
    const user = await this.userService.verifyUserCredentials({
      email: payload.email,
      password: payload.password,
      trx
    });

    return await this.generateQrCode({
      email: user.email,
      userId: user.id,
      trx
    });
  }

  async generateTwoFaQrCode({
    userId,
    trx
  }: {
    userId: string;
    trx?: Transaction;
  }) {
    const user = await this.userService.getUserById({ id: userId, trx });

    return await this.generateQrCode({
      writeToken: false,
      email: user.email,
      userId: user.id,
      trx
    });
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
    const { userId } =
      await this.confirmationHashService.getUserByConfirmationHash({
        confirmationHash,
        trx
      });

    try {
      return await this.verifyQrCode({
        userId,
        code: payload.code,
        token: payload.twoFaToken,
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
    const user = await this.userService.verifyUserCredentials({
      email: payload.email,
      password: payload.password,
      trx
    });

    try {
      return await this.verifyQrCode({
        userId: user.id,
        code: payload.code,
        token: payload.twoFaToken,
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
    try {
      return await this.verifyQrCode({
        token: payload.twoFaToken,
        code: payload.code,
        checkDbToken: false,
        userId,
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
    const userSettings = await this.userService.getUserSettingsByUserId({
      userId,
      trx
    });

    if (!userSettings.twoFaToken) throw new TwoFaNotSetUpException();
    if (!userSettings.phone) throw new PhoneNotSetUpException();

    try {
      await this.verifyQrCode({
        code: payload.code,
        token: userSettings.twoFaToken,
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
    const { userId } =
      await this.confirmationHashService.getUserByConfirmationHash({
        confirmationHash,
        trx
      });

    await this.phoneService.verifyAndResendSmsCode({
      userId,
      phone: payload.phone,
      trx
    });

    return new SmsCodeSentDto();
  }

  async loginSendSmsCode({
    payload,
    trx
  }: {
    payload: MfaLoginDto;
    trx?: Transaction;
  }) {
    const user = await this.userService.verifyUserCredentials({
      email: payload.email,
      password: payload.password,
      trx
    });

    await this.phoneService.verifyAndResendSmsCode({
      userId: user.id,
      phone: user.userSettings.phone || payload.phone,
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
    await this.phoneService.verifyAndResendSmsCode({
      phone: payload.phone,
      userId,
      trx
    });

    return new SmsCodeSentDto();
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
    const { userId } =
      await this.confirmationHashService.getUserByConfirmationHash({
        confirmationHash,
        trx
      });

    try {
      return await this.verifySmsCode({
        providedPhone: payload.phone,
        providedCode: payload.code,
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
    const user = await this.userService.verifyUserCredentials({
      email: payload.email,
      password: payload.password,
      trx
    });

    try {
      return await this.verifySmsCode({
        providedPhone: payload.phone,
        providedCode: payload.code,
        userId: user.id,
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
    try {
      return await this.verifySmsCode({
        providedPhone: payload.phone,
        providedCode: payload.code,
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
    const userSecurity = await this.userService.getUserSettingsByUserId({
      userId,
      trx
    });

    if (!userSecurity.phone) throw new PhoneNotSetUpException();
    if (!userSecurity.twoFaToken) throw new TwoFaNotSetUpException();

    try {
      await this.verifySmsCode({
        providedPhone: userSecurity.phone,
        providedCode: payload.code,
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
    const user = await this.userService.getUserById({
      id: userId,
      trx
    });

    const passwordEquals = await bcryptjs.compare(
      payload.password,
      user.password
    );
    if (!passwordEquals) throw new WrongCredentialsException();

    try {
      const mfaStatusResponse = await this.authService.checkUserMfaStatus({
        mfaCode: payload.mfaCode,
        phoneCode: payload.phoneCode,
        userSettings: user.userSettings,
        userId
      });

      if (mfaStatusResponse) return mfaStatusResponse;
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }

    if (!payload.fullName) return new DeleteConfirmationRequiredDto();

    if (payload.fullName !== `${user.firstName} ${user.lastName}`)
      throw new WrongDeletionConfirmationException();

    await this.userService.deleteUserAccount({ userId, trx });

    return new AccountDeletedDto();
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

    const fiveMinutesAgo = dayjs().subtract(5, 'minutes');

    if (phoneCode === providedCode && dayjs(codeSentAt) < fiveMinutesAgo)
      throw new SmsExpiredException();

    await this.userService.changeSecurityComplianceStatus({
      userId,
      isSecurityCompliant: true,
      trx
    });

    await this.userService.updateUserSettings({
      payload: { phoneCode: null, codeSentAt: null },
      userId,
      trx
    });

    return new MfaSetDto();
  }

  private async generateQrCode({
    email,
    userId,
    writeToken = true,
    trx
  }: {
    email: string;
    userId: string;
    writeToken?: boolean;
    trx?: Transaction;
  }) {
    const { qr, secret } = node2fa.generateSecret({
      name: 'Mnemosyne',
      account: email
    });

    if (writeToken) {
      await this.userService.updateUserSettings({
        payload: { twoFaToken: secret },
        userId,
        trx
      });
    }

    return { qr, secret };
  }

  private async verifyQrCode({
    userId,
    code,
    token,
    checkDbToken = true,
    trx
  }: {
    userId: string;
    code: string;
    token: string;
    checkDbToken?: boolean;
    trx?: Transaction;
  }) {
    const { twoFaToken } = await this.userService.getUserSettingsByUserId({
      userId,
      trx
    });

    if (token !== twoFaToken && checkDbToken)
      throw new WrongMfaTokenException();

    const delta = checkDbToken
      ? node2fa.verifyToken(twoFaToken, code)
      : node2fa.verifyToken(token, code);

    if (!delta || (delta && delta.delta !== 0)) throw new WrongCodeException();

    await this.userService.changeSecurityComplianceStatus({
      isSecurityCompliant: true,
      userId,
      trx
    });

    if (!checkDbToken) {
      await this.userService.updateUserSettings({
        payload: { twoFaToken: token },
        userId,
        trx
      });
    }

    return new MfaSetDto();
  }
}
