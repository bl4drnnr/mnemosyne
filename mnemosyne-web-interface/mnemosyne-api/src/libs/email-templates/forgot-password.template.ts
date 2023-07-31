import { UserInfoInterface } from '@interfaces/user-info.interface';
import { LANGUAGE_TYPES } from '@interfaces/language.types';
import { defaultSecurityTemplate } from '@email-templates/default-security.template';

export const forgotPasswordTemplate = ({
  userInfo,
  confirmationLink,
  language
}: {
  userInfo: UserInfoInterface;
  confirmationLink: string;
  language: LANGUAGE_TYPES;
}) => {
  let welcomeTitle: string;
  let forgotPasswordPayload: string;
  let resetPasswordButton: string;

  switch (language) {
    case LANGUAGE_TYPES.EN:
      welcomeTitle = `Hello, ${userInfo.firstName} ${userInfo.lastName}!`;
      forgotPasswordPayload =
        'In order to reset your password, please, click the button below. You will have to provide not only the new password, but also confirm the change using MFA. Link will be valid for 24h.';
      resetPasswordButton = 'Reset password';
      break;
    case LANGUAGE_TYPES.RU:
      welcomeTitle = `Здравствуйте, ${userInfo.firstName} ${userInfo.lastName}!`;
      forgotPasswordPayload =
        'Для того, чтобы сбросить пароль, пожалуйста, нажмите на кнопку ниже. Вам придется указать не только новый пароль, но и подтвердить изменение с помощью MFA. Ссылка будет действительна в течение 24 часов.';
      resetPasswordButton = 'Сбросить пароль';
      break;
    case LANGUAGE_TYPES.PL:
      welcomeTitle = `Cześć, ${userInfo.firstName} ${userInfo.lastName}!`;
      forgotPasswordPayload =
        'Aby zresetować hasło, kliknij przycisk poniżej. Będziesz musiał podać nie tylko nowe hasło, ale również potwierdzić zmianę za pomocą MFA. Link będzie ważny przez 24h.';
      resetPasswordButton = 'Resetuj hasło';
      break;
    default:
      welcomeTitle = `Hello, ${userInfo.firstName} ${userInfo.lastName}!`;
      forgotPasswordPayload =
        'In order to reset your password, please, click the button below. You will have to provide not only the new password, but also confirm the change using MFA. Link will be valid for 24h.';
      resetPasswordButton = 'Reset password';
      break;
  }

  return defaultSecurityTemplate({
    title: welcomeTitle,
    content: forgotPasswordPayload,
    button: resetPasswordButton,
    link: confirmationLink
  });
};
