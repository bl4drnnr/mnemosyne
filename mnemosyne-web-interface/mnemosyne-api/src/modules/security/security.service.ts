import * as node2fa from 'node-2fa';
import * as dayjs from 'dayjs';
import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { UsersService } from '@modules/users.service';
import { VerifyTwoFaDto } from '@dto/verify-2fa.dto';
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
      throw new HttpException(e.response.error, e.status);
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
      throw new HttpException(e.response.error, e.status);
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
    const user = await this.userService.getUserById({
      id: userId,
      trx
    });

    if (user.userSettings.twoFaToken !== payload.twoFaToken)
      throw new BadRequestException();

    try {
      return await this.verifyQrCode({
        userId: user.id,
        code: payload.code,
        token: payload.twoFaToken,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.error, e.status);
    }
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
      throw new HttpException(e.response.error, e.status);
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
      throw new HttpException(e.response.error, e.status);
    }
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
    const user = await this.userService.verifyUserCredentials({
      email: payload.email,
      password: payload.password,
      trx
    });

    if (userId !== user.id) throw new UnauthorizedException('unauthorized');

    try {
      const mfaStatusResponse = await this.authService.checkUserMfaStatus({
        mfaCode: payload.mfaCode,
        phoneCode: payload.phoneCode,
        userSettings: user.userSettings,
        userId: user.id
      });

      if (mfaStatusResponse) return mfaStatusResponse;
    } catch (e: any) {
      throw new HttpException(e.response.error, e.status);
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

    if (phone !== providedPhone) throw new BadRequestException();

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
    trx
  }: {
    email: string;
    userId: string;
    trx?: Transaction;
  }) {
    const { qr, secret } = node2fa.generateSecret({
      name: 'Mnemosyne',
      account: email
    });

    await this.userService.updateUserSettings({
      payload: { twoFaToken: secret },
      userId,
      trx
    });

    return { qr, secret };
  }

  private async verifyQrCode({
    userId,
    code,
    token,
    trx
  }: {
    userId: string;
    code: string;
    token: string;
    trx?: Transaction;
  }) {
    const { twoFaToken } = await this.userService.getUserSettingsByUserId({
      userId,
      trx
    });

    if (token !== twoFaToken) throw new BadRequestException();

    const delta = node2fa.verifyToken(twoFaToken, code);

    if (!delta || (delta && delta.delta !== 0)) throw new WrongCodeException();

    await this.userService.changeSecurityComplianceStatus({
      userId,
      isSecurityCompliant: true,
      trx
    });

    return new MfaSetDto();
  }
}
