import { Injectable } from '@nestjs/common';
import { LANGUAGE_TYPES } from '@interfaces/language.types';
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
      case LANGUAGE_TYPES.EN:
        subject = 'Mnemosyne - Registration confirmation';
        break;
      case LANGUAGE_TYPES.RU:
        subject = 'Mnemosyne - Подтверждение регистрации';
        break;
      case LANGUAGE_TYPES.PL:
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
      case LANGUAGE_TYPES.EN:
        subject = 'Mnemosyne - Welcome';
        break;
      case LANGUAGE_TYPES.RU:
        subject = 'Mnemosyne - Доборо пожаловать';
        break;
      case LANGUAGE_TYPES.PL:
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
      case LANGUAGE_TYPES.EN:
        subject = 'Mnemosyne - Password reset';
        break;
      case LANGUAGE_TYPES.RU:
        subject = 'Mnemosyne - Восстановление пароля';
        break;
      case LANGUAGE_TYPES.PL:
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
      case LANGUAGE_TYPES.EN:
        subject = 'Mnemosyne - Password successfully reset';
        break;
      case LANGUAGE_TYPES.RU:
        subject = 'Mnemosyne - Пароль сброшен';
        break;
      case LANGUAGE_TYPES.PL:
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
      case LANGUAGE_TYPES.EN:
        subject = 'Mnemosyne - Email change';
        break;
      case LANGUAGE_TYPES.RU:
        subject = 'Mnemosyne - Изменение адреса электронной почты';
        break;
      case LANGUAGE_TYPES.PL:
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
      case LANGUAGE_TYPES.EN:
        subject = 'Mnemosyne - Email changed';
        break;
      case LANGUAGE_TYPES.RU:
        subject = 'Mnemosyne - Адреса электронной почты изменен';
        break;
      case LANGUAGE_TYPES.PL:
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
