import { LANGUAGE_TYPES } from '@interfaces/language.types';
import { defaultSecurityTemplate } from '@email-templates/default-security.template';
import { SecurityEmailPayloadInterface } from '@interfaces/security-email-payload.interface';

export const resetPasswordCompletedTemplate = ({
  userInfo,
  link,
  language
}: SecurityEmailPayloadInterface) => {
  let title: string;
  let content: string;
  let button: string;

  switch (language) {
    case LANGUAGE_TYPES.EN:
      title = `Hello, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Password of your account has been successfully reset. Feel free to log in to your account using new password. Consider the fact, that you can change your password only once in 24h.';
      button = 'Log in to your account';
      break;
    case LANGUAGE_TYPES.RU:
      title = `Здравствуйте, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Пароль вашей учетной записи успешно сброшен. Не стесняйтесь войти в свою учетную запись, используя новый пароль. Учтите тот факт, что вы можете изменить свой пароль только один раз в 24 часа.';
      button = 'Войдите в свой аккаунт';
      break;
    case LANGUAGE_TYPES.PL:
      title = `Cześć, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Hasło do Twojego konta zostało pomyślnie zresetowane. Zapraszamy do logowania się na swoje konto przy użyciu nowego hasła. Weź pod uwagę fakt, że możesz zmienić swoje hasło tylko raz na 24h.';
      button = 'Zaloguj się na konto';
      break;
    default:
      title = `Hello, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Password of your account has been successfully reset. Feel free to log in to your account using new password. Consider the fact, that you can change your password only once in 24h.';
      button = 'Log in to your account';
      break;
  }

  return defaultSecurityTemplate({
    title,
    content,
    button,
    link
  });
};
