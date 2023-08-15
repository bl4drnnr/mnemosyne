import { Injectable } from '@nestjs/common';
import { Language } from '@interfaces/language.enum';
import { SmsTemplateInterface } from '@interfaces/sms-template.interface';

@Injectable()
export class SmsTemplatesService {
  verificationCodeTemplate({
    verificationCode,
    language
  }: SmsTemplateInterface) {
    switch (language) {
      case Language.EN:
        return `Mnemosyne verification code: ${verificationCode}.\nWill be valid for 5 minutes.`;
      case Language.RU:
        return `Код подтверждения Mnemosyne: ${verificationCode}.\nДействителен в течение 5 минут.`;
      case Language.PL:
        return `Kod weryfikacyjny Mnemosyne: ${verificationCode}.\nBędzie ważny przez 5 minut.`;
      default:
        return `Mnemosyne verification code: ${verificationCode}.\nWill be valid for 5 minutes.`;
    }
  }
}
