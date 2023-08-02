import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ApiConfigService } from '@shared/config.service';
import { Transaction } from 'sequelize';
import { UsersService } from '@modules/users.service';
import { TimeService } from '@shared/time.service';
import { WrongTimeframeException } from '@exceptions/wrong-timeframe.exception';
import { SmsTemplatesService } from '@shared/sms-templates.service';
import { LANGUAGE_TYPES } from '@interfaces/language.types';

@Injectable()
export class PhoneService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly configService: ApiConfigService,
    private readonly timeService: TimeService,
    private readonly smsTemplateService: SmsTemplatesService
  ) {}

  async sendSmsCode({
    targetPhoneNumber,
    language
  }: {
    targetPhoneNumber: string;
    language?: LANGUAGE_TYPES;
  }) {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const { twilio_auth_phone, twilio_auth_token, twilio_account_sid } =
      this.configService.twilioCredentials;

    const client = new Twilio(twilio_account_sid, twilio_auth_token);

    const smsBody = this.smsTemplateService.verificationCodeTemplate({
      verificationCode,
      language
    });

    await client.messages.create({
      body: smsBody,
      from: twilio_auth_phone,
      to: targetPhoneNumber
    });

    return verificationCode;
  }

  async verifyAndResendSmsCode({
    language,
    userId,
    phone,
    trx
  }: {
    language?: LANGUAGE_TYPES;
    userId: string;
    phone: string;
    trx?: Transaction;
  }) {
    const { codeSentAt } = await this.userService.getUserSettingsByUserId({
      userId,
      trx
    });

    const isWithinTwoMinutes = this.timeService.isWithinTimeframe({
      time: codeSentAt,
      seconds: 120
    });

    if (isWithinTwoMinutes) throw new WrongTimeframeException();

    const sentSmsCode = await this.sendSmsCode({
      targetPhoneNumber: phone,
      language
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
