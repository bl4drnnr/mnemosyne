import { Injectable } from '@nestjs/common';
import { Language } from '@interfaces/language.enum';
import { registrationTemplate } from '@email-templates/registration.template';
import { emailChangeTemplate } from '@email-templates/email-change.template';
import { forgotPasswordTemplate } from '@email-templates/forgot-password.template';
import { regCompletedTemplate } from '@email-templates/reg-completed.template';
import { resetPassCompletedTemplate } from '@email-templates/reset-pass-completed.template';
import { emailChangedTemplate } from '@email-templates/email-changed.template';
import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';
import { EmailTemplateInterface } from '@interfaces/email-template.interface';
import { companyRegistrationTemplate } from '@email-templates/company-registration.template';
import { companyMemberInviteTemplate } from '@email-templates/company-member-invite.template';
import { companyRegCompleteTemplate } from '@email-templates/company-reg-complete.template';
import { companyMemberConfirmInviteTemplate } from '@email-templates/company-member-confirm-invite.template';
import { CompanyPayloadInterface } from '@interfaces/company-payload.interface';
import { companyMemberDeletedTemplate } from '@email-templates/company-member-deleted.template';
import { companyDeletionTemplate } from '@email-templates/company-deletion.template';
import { ContactUsEmailInterface } from '@interfaces/contact-us-email.interface';
import { ApiConfigService } from '@shared/config.service';
import { contactUsTemplate } from '@email-templates/contact-us.template';

@Injectable()
export class EmailTemplatesService {
  constructor(private readonly apiConfigService: ApiConfigService) {}

  companyRegistrationEmailTemplate({
    companyInfo,
    link,
    language
  }: SecurityPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case Language.EN:
        subject = 'Mnemosyne - Company registration confirmation';
        break;
      case Language.RU:
        subject = 'Mnemosyne - Подтверждение регистрации компании';
        break;
      case Language.PL:
        subject = 'Mnemosyne - Potwierdzenie rejestracji firmy';
        break;
      default:
        subject = 'Mnemosyne - Company registration confirmation';
        break;
    }

    const html = companyRegistrationTemplate({
      companyInfo,
      link,
      language
    });

    return { html, subject };
  }

  companyMemberInviteEmailTemplate({
    companyInfo,
    userInfo,
    link,
    language
  }: SecurityPayloadInterface): EmailTemplateInterface {
    const companyName = companyInfo.companyName;
    let subject: string;

    switch (language) {
      case Language.EN:
        subject = `Mnemosyne - You have been invited to join ${companyName}`;
        break;
      case Language.RU:
        subject = `Mnemosyne - Вы были приглашены вступить в ${companyName}`;
        break;
      case Language.PL:
        subject = `Mnemosyne - Zaproszono Cię do dołączenia do ${companyName}`;
        break;
      default:
        subject = `Mnemosyne - You have been invited to join ${companyName}`;
        break;
    }

    const html = companyMemberInviteTemplate({
      companyInfo,
      userInfo,
      link,
      language
    });

    return { html, subject };
  }

  registrationEmailTemplate({
    userInfo,
    link,
    language
  }: SecurityPayloadInterface): EmailTemplateInterface {
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
  }: SecurityPayloadInterface): EmailTemplateInterface {
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

    const html = regCompletedTemplate({
      userInfo,
      link,
      language
    });

    return { html, subject };
  }

  companyRegistrationComplete({
    companyInfo,
    link,
    language
  }: SecurityPayloadInterface): EmailTemplateInterface {
    const companyName = companyInfo.companyName;
    let subject: string;

    switch (language) {
      case Language.EN:
        subject = `Mnemosyne - Company created - ${companyName}`;
        break;
      case Language.RU:
        subject = `Mnemosyne - Компания создана - ${companyName}`;
        break;
      case Language.PL:
        subject = `Mnemosyne - Firma utworzona - ${companyName}`;
        break;
      default:
        subject = `Mnemosyne - Company created - ${companyName}`;
        break;
    }

    const html = companyRegCompleteTemplate({
      companyInfo,
      link,
      language
    });

    return { html, subject };
  }

  companyMemberConfirmCompleteEmail({
    link,
    companyName,
    language
  }: SecurityPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case Language.EN:
        subject = `Mnemosyne - Company invitation confirmed - ${companyName}`;
        break;
      case Language.RU:
        subject = `Mnemosyne - Приглашение компании подтверждено - ${companyName}`;
        break;
      case Language.PL:
        subject = `Mnemosyne - Zaproszenie firmy potwierdzone - ${companyName}`;
        break;
      default:
        subject = `Mnemosyne - Company invitation confirmed - ${companyName}`;
        break;
    }

    const html = companyMemberConfirmInviteTemplate({
      link,
      companyName,
      language
    });

    return { html, subject };
  }

  forgotPasswordEmailTemplate({
    userInfo,
    link,
    language
  }: SecurityPayloadInterface): EmailTemplateInterface {
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
  }: SecurityPayloadInterface): EmailTemplateInterface {
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

    const html = resetPassCompletedTemplate({
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
  }: SecurityPayloadInterface): EmailTemplateInterface {
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
  }: SecurityPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case Language.EN:
        subject = 'Mnemosyne - Email changed';
        break;
      case Language.RU:
        subject = 'Mnemosyne - Адреса электронной почты изменен';
        break;
      case Language.PL:
        subject = 'Mnemosyne - Adres e-mail został zmieniony';
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

  userDeletedFromCompany({
    language,
    performedBy,
    companyName
  }: CompanyPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case Language.EN:
        subject = 'Mnemosyne - You have been deleted from the company';
        break;
      case Language.RU:
        subject = 'Mnemosyne - Вас удалили из компании';
        break;
      case Language.PL:
        subject = 'Mnemosyne - Zostałeś usunięty z firmy';
        break;
      default:
        subject = 'Mnemosyne - You have been deleted from the company';
        break;
    }

    const html = companyMemberDeletedTemplate({
      language,
      performedBy,
      companyName
    });

    return { html, subject };
  }

  companyDeletion({
    language,
    performedBy,
    companyName
  }: CompanyPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case Language.EN:
        subject = 'Mnemosyne - Company deletion';
        break;
      case Language.RU:
        subject = 'Mnemosyne - Удаление компании';
        break;
      case Language.PL:
        subject = 'Mnemosyne - Usunięcie firmy';
        break;
      default:
        subject = 'Mnemosyne - Company deletion';
        break;
    }

    const html = companyDeletionTemplate({
      language,
      performedBy,
      companyName
    });

    return { html, subject };
  }

  contactUs({ from, message, language }: ContactUsEmailInterface) {
    let subject: string;

    switch (language) {
      case Language.EN:
        subject = 'Mnemosyne - User Feedback';
        break;
      case Language.RU:
        subject = 'Mnemosyne - Отзывы Пользователей';
        break;
      case Language.PL:
        subject = 'Mnemosyne - Opinie Użytkowników';
        break;
      default:
        subject = 'Mnemosyne - User Feedback';
        break;
    }

    const receiver = this.apiConfigService.contactUsReceiver;
    const html = contactUsTemplate({ from, message, language });

    return { html, subject, receiver };
  }
}
