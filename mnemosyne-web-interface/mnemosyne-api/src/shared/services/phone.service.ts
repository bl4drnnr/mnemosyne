import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ApiConfigService } from '@shared/config.service';
import { UsersService } from '@modules/users.service';
import { TimeService } from '@shared/time.service';
import { WrongTimeframeException } from '@exceptions/wrong-timeframe.exception';
import { SmsTemplatesService } from '@shared/sms-templates.service';
import { VerifyAndResendInterface } from '@interfaces/verify-and-resend.interface';
import { SendPhoneSmsInterface } from '@interfaces/send-phone-sms.interface';

@Injectable()
export class PhoneService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly configService: ApiConfigService,
    private readonly timeService: TimeService,
    private readonly smsTemplateService: SmsTemplatesService
  ) {}

  async sendSmsCode({ to, language }: SendPhoneSmsInterface) {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const { twilioAuthPhone, twilioAuthToken, twilioAccountSid } =
      this.configService.twilioCredentials;

    const client = new Twilio(twilioAccountSid, twilioAuthToken);

    const body = this.smsTemplateService.verificationCodeTemplate({
      verificationCode,
      language
    });

    await client.messages.create({
      body,
      to,
      from: twilioAuthPhone
    });

    return verificationCode.toString();
  }

  async verifyTimeframeAndResendSmsCode({
    language,
    userId,
    phone,
    trx
  }: VerifyAndResendInterface) {
    const { codeSentAt } = await this.usersService.getUserSettingsByUserId({
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

    await this.usersService.updateUserSettings({
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
