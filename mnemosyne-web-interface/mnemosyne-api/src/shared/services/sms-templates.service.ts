import { Injectable } from '@nestjs/common';
import { LANGUAGE_TYPES } from '@interfaces/language.types';
import { SmsTemplateInterface } from '@interfaces/sms-template.interface';

@Injectable()
export class SmsTemplatesService {
  verificationCodeTemplate({
    verificationCode,
    language
  }: SmsTemplateInterface) {
    switch (language) {
      case LANGUAGE_TYPES.EN:
        return `Mnemosyne verification code: ${verificationCode}.\nWill be valid for 5 minutes.`;
      case LANGUAGE_TYPES.RU:
        return `Код подтверждения Mnemosyne: ${verificationCode}.\nДействителен в течение 5 минут.`;
      case LANGUAGE_TYPES.PL:
        return `Kod weryfikacyjny Mnemosyne: ${verificationCode}.\nBędzie ważny przez 5 minut.`;
      default:
        return `Mnemosyne verification code: ${verificationCode}.\nWill be valid for 5 minutes.`;
    }
  }
}
