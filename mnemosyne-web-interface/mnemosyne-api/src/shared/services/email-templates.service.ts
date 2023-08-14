import { Injectable } from '@nestjs/common';
import { LanguageEnum } from '@interfaces/language.enum';
import { registrationTemplate } from '@email-templates/registration.template';
import { emailChangeTemplate } from '@email-templates/email-change.template';
import { forgotPasswordTemplate } from '@email-templates/forgot-password.template';
import { registrationCompletedTemplate } from '@email-templates/registration-completed.template';
import { resetPasswordCompletedTemplate } from '@email-templates/reset-password-completed.template';
import { emailChangedTemplate } from '@email-templates/email-changed.template';
import { SecurityEmailPayloadInterface } from '@interfaces/security-email-payload.interface';
import { EmailTemplateInterface } from '@interfaces/email-template.interface';

@Injectable()
export class EmailTemplatesService {
  registrationEmailTemplate({
    userInfo,
    link,
    language
  }: SecurityEmailPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case LanguageEnum.EN:
        subject = 'Mnemosyne - Registration confirmation';
        break;
      case LanguageEnum.RU:
        subject = 'Mnemosyne - Подтверждение регистрации';
        break;
      case LanguageEnum.PL:
        subject = 'Mnemosyne - Potwierdzenie rejestracji';
        break;
      default:
        subject = 'Mnemosyne - Registration confirmation';
        break;
    }

    const html = registrationTemplate({
      userInfo,
      link,
      language
    });

    return { html, subject };
  }

  registrationComplete({
    userInfo,
    link,
    language
  }: SecurityEmailPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case LanguageEnum.EN:
        subject = 'Mnemosyne - Welcome';
        break;
      case LanguageEnum.RU:
        subject = 'Mnemosyne - Доборо пожаловать';
        break;
      case LanguageEnum.PL:
        subject = 'Mnemosyne - Witamy';
        break;
      default:
        subject = 'Mnemosyne - Welcome';
        break;
    }

    const html = registrationCompletedTemplate({
      link,
      userInfo,
      language
    });

    return { html, subject };
  }

  forgotPasswordEmailTemplate({
    userInfo,
    link,
    language
  }: SecurityEmailPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case LanguageEnum.EN:
        subject = 'Mnemosyne - Password reset';
        break;
      case LanguageEnum.RU:
        subject = 'Mnemosyne - Восстановление пароля';
        break;
      case LanguageEnum.PL:
        subject = 'Mnemosyne - Przypomnienie hasła';
        break;
      default:
        subject = 'Mnemosyne - Password reset';
        break;
    }

    const html = forgotPasswordTemplate({
      userInfo,
      link,
      language
    });

    return { html, subject };
  }

  resetPasswordComplete({
    userInfo,
    link,
    language
  }: SecurityEmailPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case LanguageEnum.EN:
        subject = 'Mnemosyne - Password successfully reset';
        break;
      case LanguageEnum.RU:
        subject = 'Mnemosyne - Пароль сброшен';
        break;
      case LanguageEnum.PL:
        subject = 'Mnemosyne - Hasło zresetowane';
        break;
      default:
        subject = 'Mnemosyne - Password successfully reset';
        break;
    }

    const html = resetPasswordCompletedTemplate({
      userInfo,
      link,
      language
    });

    return { html, subject };
  }

  emailChangeEmailTemplate({
    userInfo,
    link,
    language
  }: SecurityEmailPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case LanguageEnum.EN:
        subject = 'Mnemosyne - Email change';
        break;
      case LanguageEnum.RU:
        subject = 'Mnemosyne - Изменение адреса электронной почты';
        break;
      case LanguageEnum.PL:
        subject = 'Mnemosyne - Zmiana adresu e-mail';
        break;
      default:
        subject = 'Mnemosyne - Email change';
        break;
    }

    const html = emailChangeTemplate({
      userInfo,
      link,
      language
    });

    return { html, subject };
  }

  emailChangeComplete({
    userInfo,
    link,
    language
  }: SecurityEmailPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case LanguageEnum.EN:
        subject = 'Mnemosyne - Email changed';
        break;
      case LanguageEnum.RU:
        subject = 'Mnemosyne - Адреса электронной почты изменен';
        break;
      case LanguageEnum.PL:
        subject = 'Mnemosyne -  Adres e-mail został zmieniony';
        break;
      default:
        subject = 'Mnemosyne - Email changed';
        break;
    }

    const html = emailChangedTemplate({
      userInfo,
      link,
      language
    });

    return { html, subject };
  }
}
