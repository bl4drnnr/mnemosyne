import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ApiConfigService } from '@shared/config.service';
import { UsersService } from '@modules/users.service';
import { TimeService } from '@shared/time.service';
import { WrongTimeframeException } from '@exceptions/wrong-timeframe.exception';
import { SmsTemplatesService } from '@shared/sms-templates.service';
import { VerifyAndResendInterface } from '@interfaces/verify-and-resend.interface';
import { SendSmsInterface } from '@interfaces/send-sms.interface';

@Injectable()
export class PhoneService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly configService: ApiConfigService,
    private readonly timeService: TimeService,
    private readonly smsTemplateService: SmsTemplatesService
  ) {}

  async sendSmsCode({ to, language }: SendSmsInterface) {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const { twilio_auth_phone, twilio_auth_token, twilio_account_sid } =
      this.configService.twilioCredentials;

    const client = new Twilio(twilio_account_sid, twilio_auth_token);

    const body = this.smsTemplateService.verificationCodeTemplate({
      verificationCode,
      language
    });

    await client.messages.create({
      body,
      to,
      from: twilio_auth_phone
    });

    return verificationCode.toString();
  }

  async verifyAndResendSmsCode({
    language,
    userId,
    phone,
    trx
  }: VerifyAndResendInterface) {
    const { codeSentAt } = await this.userService.getUserSettingsByUserId({
      userId,
      trx
    });

    const isWithinTwoMinutes = this.timeService.isWithinTimeframe({
      time: codeSentAt,
      seconds: 120
    });

    if (isWithinTwoMinutes) throw new WrongTimeframeException();

    const phoneCode = await this.sendSmsCode({
      to: phone,
      language
    });

    await this.userService.updateUserSettings({
      payload: {
        phone,
        phoneCode,
        codeSentAt: new Date()
      },
      userId,
      trx
    });
  }
}
