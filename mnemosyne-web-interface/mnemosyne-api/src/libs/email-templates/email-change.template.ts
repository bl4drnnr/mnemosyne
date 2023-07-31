import { UserInfoInterface } from '@interfaces/user-info.interface';
import { LANGUAGE_TYPES } from '@interfaces/language.types';
import { defaultSecurityTemplate } from '@email-templates/default-security.template';

export const emailChangeTemplate = ({
  userInfo,
  confirmationLink,
  language
}: {
  userInfo: UserInfoInterface;
  confirmationLink: string;
  language: LANGUAGE_TYPES;
}) => {
  let welcomeTitle: string;
  let emailChangePayload: string;
  let continueButton: string;

  switch (language) {
    case LANGUAGE_TYPES.EN:
      welcomeTitle = `Hello, ${userInfo.firstName} ${userInfo.lastName}!`;
      emailChangePayload =
        'In order to change the email of your account, please, click the button below. You will have to confirm this action using your password and MFA. Keep in mind that you are allowed to change the email of your account only once. Link will be valid of 24h.';
      continueButton = 'Confirm email change';
      break;
    case LANGUAGE_TYPES.RU:
      welcomeTitle = `Здравствуйте, ${userInfo.firstName} ${userInfo.lastName}!`;
      emailChangePayload =
        'Для того, чтобы изменить адрес электронной почты вашей учетной записи, пожалуйста, нажмите кнопку ниже. Вам нужно будет подтвердить это действие, используя свой пароль и MFA. Имейте в виду, что вы можете изменить адрес электронной почты своей учетной записи только один раз. Ссылка будет действительна в течение 24 часов.';
      continueButton = 'Подтвердить изменение электронной почты';
      break;
    case LANGUAGE_TYPES.PL:
      welcomeTitle = `Cześć, ${userInfo.firstName} ${userInfo.lastName}!`;
      emailChangePayload =
        'Aby zmienić adres e-mail swojego konta, kliknij przycisk poniżej. Będziesz musiał potwierdzić tę czynność za pomocą hasła i MFA. Pamiętaj, że możesz zmienić adres e-mail swojego konta tylko raz. Link będzie ważny przez 24h.';
      continueButton = 'Potwierdź zmianę adresu e-mail';
      break;
    default:
      welcomeTitle = `Hello, ${userInfo.firstName} ${userInfo.lastName}!`;
      emailChangePayload =
        'In order to change the email of your account, please, click the button below. You will have to confirm this action using your password and MFA. Keep in mind that you are allowed to change the email of your account only once. Link will be valid of 24h.';
      continueButton = 'Confirm email change';
      break;
  }

  return defaultSecurityTemplate({
    title: welcomeTitle,
    content: emailChangePayload,
    button: continueButton,
    link: confirmationLink
  });
};
