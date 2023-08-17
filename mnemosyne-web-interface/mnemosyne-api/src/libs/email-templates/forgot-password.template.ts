import { Language } from '@interfaces/language.enum';
import { defaultSecurityTemplate } from '@email-templates/default-security.template';
import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';

export const forgotPasswordTemplate = ({
  userInfo,
  link,
  language
}: SecurityPayloadInterface) => {
  let title: string;
  let content: string;
  let button: string;

  switch (language) {
    case Language.EN:
      title = `Hello, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'In order to reset your password, please, click the button below. You will have to provide not only the new password, but also confirm the change using MFA. Link will be valid for 24h.';
      button = 'Reset password';
      break;
    case Language.RU:
      title = `Здравствуйте, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Для того, чтобы сбросить пароль, пожалуйста, нажмите на кнопку ниже. Вам придется указать не только новый пароль, но и подтвердить изменение с помощью MFA. Ссылка будет действительна в течение 24 часов.';
      button = 'Сбросить пароль';
      break;
    case Language.PL:
      title = `Cześć, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Aby zresetować hasło, kliknij przycisk poniżej. Będziesz musiał podać nie tylko nowe hasło, ale również potwierdzić zmianę za pomocą MFA. Link będzie ważny przez 24h.';
      button = 'Resetuj hasło';
      break;
    default:
      title = `Hello, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'In order to reset your password, please, click the button below. You will have to provide not only the new password, but also confirm the change using MFA. Link will be valid for 24h.';
      button = 'Reset password';
      break;
  }

  return defaultSecurityTemplate({
    title,
    content,
    button,
    link
  });
};
