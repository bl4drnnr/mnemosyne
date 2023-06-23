import { BadRequestException, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ApiConfigService } from '@shared/config.service';
import { Transaction } from 'sequelize';
import { UsersService } from '@modules/users.service';
import * as dayjs from 'dayjs';

@Injectable()
export class PhoneService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ApiConfigService
  ) {}

  async sendSmsCode({ targetPhoneNumber }: { targetPhoneNumber: string }) {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const { twilio_auth_phone, twilio_auth_token, twilio_account_sid } =
      this.configService.twilioCredentials;

    const client = new Twilio(twilio_account_sid, twilio_auth_token);

    await client.messages.create({
      body: `Mnemosyne verification code: ${verificationCode}.\nWill be valid for 5 minutes.`,
      from: twilio_auth_phone,
      to: targetPhoneNumber
    });

    return verificationCode;
  }

  async verifyAndResendSmsCode({
    userId,
    phone,
    trx
  }: {
    userId: string;
    phone: string;
    trx?: Transaction;
  }) {
    const { codeSentAt } = await this.userService.getUserSettingsByUserId({
      userId,
      trx
    });

    const oneMinuteAgo = dayjs().subtract(1, 'minute');

    if (dayjs(codeSentAt) < oneMinuteAgo) throw new BadRequestException();

    const sentSmsCode = await this.sendSmsCode({
      targetPhoneNumber: phone
    });

    await this.userService.updateUserSettings({
      payload: {
        phone,
        phoneCode: sentSmsCode.toString(),
        codeSentAt: new Date()
      },
      userId,
      trx
    });
  }
}
