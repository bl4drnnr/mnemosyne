import { Injectable } from '@nestjs/common';
import { Language } from '@interfaces/language.enum';
import { registrationTemplate } from '@email-templates/registration.template';
import { emailChangeTemplate } from '@email-templates/email-change.template';
import { forgotPasswordTemplate } from '@email-templates/forgot-password.template';
import { registrationCompletedTemplate } from '@email-templates/registration-completed.template';
import { resetPasswordCompletedTemplate } from '@email-templates/reset-password-completed.template';
import { emailChangedTemplate } from '@email-templates/email-changed.template';
import { SecurityEmailPayloadInterface } from '@interfaces/security-email-payload.interface';
import { EmailTemplateInterface } from '@interfaces/email-template.interface';
import { companyRegistrationTemplate } from '@email-templates/company-registration.template';

@Injectable()
export class EmailTemplatesService {
  companyRegistrationEmailTemplate({
    companyInfo,
    link,
    language
  }: SecurityEmailPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case Language.EN:
        subject = '';
        break;
      case Language.RU:
        subject = '';
        break;
      case Language.PL:
        subject = '';
        break;
      default:
        subject = '';
        break;
    }

    const html = companyRegistrationTemplate({
      companyInfo,
      link,
      language
    });

    return { html, subject };
  }

  registrationEmailTemplate({
    userInfo,
    link,
    language
  }: SecurityEmailPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case Language.EN:
        subject = 'Mnemosyne - Registration confirmation';
        break;
      case Language.RU:
        subject = 'Mnemosyne - Подтверждение регистрации';
        break;
      case Language.PL:
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
      case Language.EN:
        subject = 'Mnemosyne - Welcome';
        break;
      case Language.RU:
        subject = 'Mnemosyne - Доборо пожаловать';
        break;
      case Language.PL:
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
      case Language.EN:
        subject = 'Mnemosyne - Password reset';
        break;
      case Language.RU:
        subject = 'Mnemosyne - Восстановление пароля';
        break;
      case Language.PL:
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
      case Language.EN:
        subject = 'Mnemosyne - Password successfully reset';
        break;
      case Language.RU:
        subject = 'Mnemosyne - Пароль сброшен';
        break;
      case Language.PL:
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
      case Language.EN:
        subject = 'Mnemosyne - Email change';
        break;
      case Language.RU:
        subject = 'Mnemosyne - Изменение адреса электронной почты';
        break;
      case Language.PL:
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
      case Language.EN:
        subject = 'Mnemosyne - Email changed';
        break;
      case Language.RU:
        subject = 'Mnemosyne - Адреса электронной почты изменен';
        break;
      case Language.PL:
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
