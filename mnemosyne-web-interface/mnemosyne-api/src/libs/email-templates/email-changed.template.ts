import { LanguageEnum } from '@interfaces/language.enum';
import { defaultSecurityTemplate } from '@email-templates/default-security.template';
import { SecurityEmailPayloadInterface } from '@interfaces/security-email-payload.interface';

export const emailChangedTemplate = ({
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
        'You email address has been successfully changed! Feel free to log in using the new one. Keep in mind, that you are allowed to change the email only one time.';
      button = 'Log in to your account';
      break;
    case LanguageEnum.RU:
      title = `Здравствуйте, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Ваш адрес электронной почты был успешно изменен! Не стесняйтесь войти в систему, используя новый. Имейте в виду, что вы можете изменить адрес электронной почты только один раз.';
      button = 'Войдите в свой аккаунт';
      break;
    case LanguageEnum.PL:
      title = `Cześć, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Twój adres e-mail został pomyślnie zmieniony! Zapraszamy do logowania się przy użyciu nowego. Pamiętaj, że e-mail możesz zmienić tylko raz.';
      button = 'Zaloguj się na konto';
      break;
    default:
      title = `Hello, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'You email address has been successfully changed! Feel free to log in using the new one. Keep in mind, that you are allowed to change the email only one time.';
      break;
  }

  return defaultSecurityTemplate({
    title,
    content,
    button,
    link
  });
};
