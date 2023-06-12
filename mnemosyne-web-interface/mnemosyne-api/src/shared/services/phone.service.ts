import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ApiConfigService } from '@shared/config.service';

@Injectable()
export class PhoneService {
  constructor(private readonly configService: ApiConfigService) {}

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
}
