import { Injectable } from '@nestjs/common';
import { UserInfoInterface } from '@interfaces/user-info.interface';
import { LANGUAGE_TYPES } from '@interfaces/language.types';
import { registrationTemplate } from '@email-templates/registration.template';
import { emailChangeTemplate } from '@email-templates/email-change.template';
import { forgotPasswordTemplate } from '@email-templates/forgot-password.template';

@Injectable()
export class EmailTemplatesService {
  registrationEmailTemplate({
    userInfo,
    confirmationLink,
    language
  }: {
    userInfo: UserInfoInterface;
    confirmationLink: string;
    language: LANGUAGE_TYPES | null;
  }): { htmlPayload: string; subject: string } {
    switch (language) {
      case LANGUAGE_TYPES.EN:
        return {
          htmlPayload: registrationTemplate({
            userInfo,
            confirmationLink,
            language: LANGUAGE_TYPES.EN
          }),
          subject: 'Mnemosyne - Registration confirmation'
        };
      case LANGUAGE_TYPES.RU:
        return {
          htmlPayload: registrationTemplate({
            userInfo,
            confirmationLink,
            language: LANGUAGE_TYPES.RU
          }),
          subject: 'Mnemosyne - Подтверждение регистрации'
        };
      case LANGUAGE_TYPES.PL:
        return {
          htmlPayload: registrationTemplate({
            userInfo,
            confirmationLink,
            language: LANGUAGE_TYPES.PL
          }),
          subject: 'Mnemosyne - Potwierdzenie rejestracji'
        };
      default:
        return {
          htmlPayload: registrationTemplate({
            userInfo,
            confirmationLink,
            language: LANGUAGE_TYPES.EN
          }),
          subject: 'Mnemosyne - Registration confirmation'
        };
    }
  }

  forgotPasswordEmailTemplate({
    userInfo,
    confirmationLink,
    language
  }: {
    userInfo: UserInfoInterface;
    confirmationLink: string;
    language: LANGUAGE_TYPES | null;
  }): { htmlPayload: string; subject: string } {
    switch (language) {
      case LANGUAGE_TYPES.EN:
        return {
          htmlPayload: forgotPasswordTemplate({
            userInfo,
            confirmationLink,
            language: LANGUAGE_TYPES.EN
          }),
          subject: 'Mnemosyne - Password reset'
        };
      case LANGUAGE_TYPES.RU:
        return {
          htmlPayload: forgotPasswordTemplate({
            userInfo,
            confirmationLink,
            language: LANGUAGE_TYPES.RU
          }),
          subject: 'Mnemosyne - Восстановление пароля'
        };
      case LANGUAGE_TYPES.PL:
        return {
          htmlPayload: forgotPasswordTemplate({
            userInfo,
            confirmationLink,
            language: LANGUAGE_TYPES.PL
          }),
          subject: 'Mnemosyne - Przypomnienie hasła'
        };
      default:
        return {
          htmlPayload: forgotPasswordTemplate({
            userInfo,
            confirmationLink,
            language: LANGUAGE_TYPES.EN
          }),
          subject: 'Mnemosyne - Password reset'
        };
    }
  }

  emailChangeEmailTemplate({
    userInfo,
    confirmationLink,
    language
  }: {
    userInfo: UserInfoInterface;
    confirmationLink: string;
    language: LANGUAGE_TYPES | null;
  }): { htmlPayload: string; subject: string } {
    switch (language) {
      case LANGUAGE_TYPES.EN:
        return {
          htmlPayload: emailChangeTemplate({
            userInfo,
            confirmationLink,
            language: LANGUAGE_TYPES.EN
          }),
          subject: 'Mnemosyne - Email change'
        };
      case LANGUAGE_TYPES.RU:
        return {
          htmlPayload: emailChangeTemplate({
            userInfo,
            confirmationLink,
            language: LANGUAGE_TYPES.RU
          }),
          subject: 'Mnemosyne - Изменение адреса электронной почты'
        };
      case LANGUAGE_TYPES.PL:
        return {
          htmlPayload: emailChangeTemplate({
            userInfo,
            confirmationLink,
            language: LANGUAGE_TYPES.PL
          }),
          subject: 'Mnemosyne - Zmiana adresu e-mail'
        };
      default:
        return {
          htmlPayload: emailChangeTemplate({
            userInfo,
            confirmationLink,
            language: LANGUAGE_TYPES.EN
          }),
          subject: 'Mnemosyne - Email change'
        };
    }
  }
}
