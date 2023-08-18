import { Language } from '@interfaces/language.enum';
import { defaultSecurityTemplate } from '@email-templates/default-security.template';
import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';

export const resetPassCompletedTemplate = ({
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
        'Password of your account has been successfully reset. Feel free to log in to your account using new password. Consider the fact, that you can change your password only once in 24h.';
      button = 'Log in to your account';
      break;
    case Language.RU:
      title = `Здравствуйте, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Пароль вашей учетной записи успешно сброшен. Не стесняйтесь войти в свою учетную запись, используя новый пароль. Учтите тот факт, что вы можете изменить свой пароль только один раз в 24 часа.';
      button = 'Войдите в свой аккаунт';
      break;
    case Language.PL:
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
