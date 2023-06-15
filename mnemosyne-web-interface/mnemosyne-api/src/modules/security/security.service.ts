import * as node2fa from 'node-2fa';
import * as dayjs from 'dayjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { UsersService } from '@modules/users.service';
import { VerifyTwoFaDto } from '@dto/verify-2fa.dto';
import { WrongCodeException } from '@exceptions/wrong-code.exception';
import { MfaSetDto } from '@dto/mfa-set.dto';
import { SendSmsCodeDto } from '@dto/send-sms-code.dto';
import { PhoneService } from '@shared/phone.service';
import { VerifyMobilePhoneDto } from '@dto/verify-mobile-phone.dto';
import { SmsCodeSentDto } from '@dto/sms-code-sent.dto';
import { SmsExpiredException } from '@exceptions/sms-expired.exception';

@Injectable()
export class SecurityService {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService,
    private readonly userService: UsersService,
    private readonly phoneService: PhoneService
  ) {}

  async generate2FaQrCode({ confirmationHash }: { confirmationHash: string }) {
    const { userId } =
      await this.confirmationHashService.getUserByConfirmationHash({
        confirmationHash
      });
    const user = await this.userService.getUserById({ id: userId });

    const { qr, secret } = node2fa.generateSecret({
      name: 'Mnemosyne',
      account: user.email
    });

    await this.userService.updateUserSettings({
      payload: { twoFaToken: secret },
      userId
    });

    return { qr };
  }

  async verifyTwoFaQrCode({
    payload,
    confirmationHash
  }: {
    payload: VerifyTwoFaDto;
    confirmationHash: string;
  }) {
    let userId: string;

    if (confirmationHash) {
      const userConfirmationHash =
        await this.confirmationHashService.getUserByConfirmationHash({
          confirmationHash
        });
      userId = userConfirmationHash.userId;
    }

    const { twoFaToken } = await this.userService.getUserSettingsByUserId({
      userId
    });

    const delta = node2fa.verifyToken(twoFaToken, payload.code);

    if (!delta || (delta && delta.delta !== 0)) throw new WrongCodeException();

    await this.userService.changeSecurityComplianceStatus({
      userId,
      isSecurityCompliant: true
    });

    return new MfaSetDto();
  }

  async sendSmsCode({
    payload,
    confirmationHash
  }: {
    payload: SendSmsCodeDto;
    confirmationHash: string;
  }) {
    let userId: string;

    if (confirmationHash) {
      const userConfirmationHash =
        await this.confirmationHashService.getUserByConfirmationHash({
          confirmationHash
        });
      userId = userConfirmationHash.userId;
    }

    const { codeSentAt } = await this.userService.getUserSettingsByUserId({
      userId
    });

    const oneMinuteAgo = dayjs().subtract(1, 'minute');

    if (dayjs(codeSentAt) < oneMinuteAgo) throw new BadRequestException();

    const sentSmsCode = await this.phoneService.sendSmsCode({
      targetPhoneNumber: payload.phone
    });

    await this.userService.updateUserSettings({
      payload: {
        phone: payload.phone,
        phoneCode: sentSmsCode.toString(),
        codeSentAt: new Date()
      },
      userId
    });

    return new SmsCodeSentDto();
  }

  async verifyMobilePhone({
    payload,
    confirmationHash
  }: {
    payload: VerifyMobilePhoneDto;
    confirmationHash: string;
  }) {
    let userId: string;

    if (confirmationHash) {
      const userConfirmationHash =
        await this.confirmationHashService.getUserByConfirmationHash({
          confirmationHash
        });
      userId = userConfirmationHash.userId;
    }

    const { codeSentAt, phoneCode, phone } =
      await this.userService.getUserSettingsByUserId({ userId });

    if (phone !== payload.phone) throw new BadRequestException();

    if (phoneCode !== payload.code) throw new WrongCodeException();

    const fiveMinutesAgo = dayjs().subtract(5, 'minutes');

    if (phoneCode === payload.code && dayjs(codeSentAt) < fiveMinutesAgo)
      throw new SmsExpiredException();

    await this.userService.changeSecurityComplianceStatus({
      userId,
      isSecurityCompliant: true
    });

    await this.userService.updateUserSettings({
      payload: { phoneCode: null, codeSentAt: null },
      userId
    });

    return new MfaSetDto();
  }
}
