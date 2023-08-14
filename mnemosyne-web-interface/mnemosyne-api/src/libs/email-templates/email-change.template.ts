import { LanguageEnum } from '@interfaces/language.enum';
import { defaultSecurityTemplate } from '@email-templates/default-security.template';
import { SecurityEmailPayloadInterface } from '@interfaces/security-email-payload.interface';

export const emailChangeTemplate = ({
  userInfo,
  link,
  language
}: SecurityEmailPayloadInterface) => {
  let title: string;
  let content: string;
  let button: string;

  switch (language) {
    case LanguageEnum.EN:
      title = `Hello, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'In order to change the email of your account, please, click the button below. You will have to confirm this action using your password and MFA. Keep in mind that you are allowed to change the email of your account only once. Link will be valid of 24h.';
      button = 'Confirm email change';
      break;
    case LanguageEnum.RU:
      title = `Здравствуйте, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Для того, чтобы изменить адрес электронной почты вашей учетной записи, пожалуйста, нажмите кнопку ниже. Вам нужно будет подтвердить это действие, используя свой пароль и MFA. Имейте в виду, что вы можете изменить адрес электронной почты своей учетной записи только один раз. Ссылка будет действительна в течение 24 часов.';
      button = 'Подтвердить изменение электронной почты';
      break;
    case LanguageEnum.PL:
      title = `Cześć, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Aby zmienić adres e-mail swojego konta, kliknij przycisk poniżej. Będziesz musiał potwierdzić tę czynność za pomocą hasła i MFA. Pamiętaj, że możesz zmienić adres e-mail swojego konta tylko raz. Link będzie ważny przez 24h.';
      button = 'Potwierdź zmianę adresu e-mail';
      break;
    default:
      title = `Hello, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'In order to change the email of your account, please, click the button below. You will have to confirm this action using your password and MFA. Keep in mind that you are allowed to change the email of your account only once. Link will be valid of 24h.';
      button = 'Confirm email change';
      break;
  }

  return defaultSecurityTemplate({
    title,
    content,
    button,
    link
  });
};
