import * as node2fa from 'node-2fa';
import * as dayjs from 'dayjs';
import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable()
export class SecurityService {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService,
    private readonly userService: UsersService,
    private readonly phoneService: PhoneService
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

    const { qr, secret } = node2fa.generateSecret({
      name: 'Mnemosyne',
      account: user.email
    });

    await this.userService.updateUserSettings({
      payload: { twoFaToken: secret },
      userId,
      trx
    });

    return { qr };
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

    const { qr, secret } = node2fa.generateSecret({
      name: 'Mnemosyne',
      account: user.email
    });

    await this.userService.updateUserSettings({
      payload: { twoFaToken: secret },
      userId: user.id,
      trx
    });

    return { qr };
  }

  async verifyTwoFaQrCode({
    payload,
    confirmationHash,
    trx
  }: {
    payload: VerifyTwoFaDto;
    confirmationHash: string;
    trx?: Transaction;
  }) {
    let userId: string;

    if (confirmationHash) {
      const userConfirmationHash =
        await this.confirmationHashService.getUserByConfirmationHash({
          confirmationHash,
          trx
        });
      userId = userConfirmationHash.userId;
    }

    const { twoFaToken } = await this.userService.getUserSettingsByUserId({
      userId,
      trx
    });

    const delta = node2fa.verifyToken(twoFaToken, payload.code);

    if (!delta || (delta && delta.delta !== 0)) throw new WrongCodeException();

    await this.userService.changeSecurityComplianceStatus({
      userId,
      isSecurityCompliant: true,
      trx
    });

    return new MfaSetDto();
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
      phone: user.userSettings.phone,
      trx
    });

    return new SmsCodeSentDto();
  }

  async verifyMobilePhone({
    payload,
    confirmationHash,
    trx
  }: {
    payload: VerifyMobilePhoneDto;
    confirmationHash: string;
    trx?: Transaction;
  }) {
    let userId: string;

    if (confirmationHash) {
      const userConfirmationHash =
        await this.confirmationHashService.getUserByConfirmationHash({
          confirmationHash,
          trx
        });
      userId = userConfirmationHash.userId;
    }

    const { codeSentAt, phoneCode, phone } =
      await this.userService.getUserSettingsByUserId({ userId, trx });

    if (phone !== payload.phone) throw new BadRequestException();

    if (phoneCode !== payload.code) throw new WrongCodeException();

    const fiveMinutesAgo = dayjs().subtract(5, 'minutes');

    if (phoneCode === payload.code && dayjs(codeSentAt) < fiveMinutesAgo)
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
}
