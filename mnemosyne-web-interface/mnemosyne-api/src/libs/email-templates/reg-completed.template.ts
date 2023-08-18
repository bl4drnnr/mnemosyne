import { Language } from '@interfaces/language.enum';
import { defaultSecurityTemplate } from '@email-templates/default-security.template';
import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';

export const regCompletedTemplate = ({
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
        'Welcome to Mnemosyne! It is nice to see being the part of our community. In order to log in to your account, you need to set up MFA and set of recovery keys if you have not done it while confirmation. Click the button below to continue.';
      button = 'Log in to your account';
      break;
    case Language.RU:
      title = `Здравствуйте, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Добро пожаловать в Мнемозину! Приятно видеть себя частью нашего сообщества. Чтобы войти в свою учетную запись, вам необходимо настроить MFA и набор ключей восстановления, если вы этого не сделали при подтверждении. Для продолжения нажмите кнопку снизу.';
      button = 'Войдите в свой аккаунт';
      break;
    case Language.PL:
      title = `Cześć, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Witamy w Mnemosyne! Miło jest widzieć, że jesteśmy częścią naszej społeczności. Aby zalogować się na swoje konto, musisz skonfigurować MFA i zestaw kluczy odzyskiwania, jeśli nie zrobiłeś tego podczas potwierdzania. Kliknij przycisk poniżej, aby kontynuować.';
      button = 'Zaloguj się na konto';
      break;
    default:
      title = `Hello, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Welcome to Mnemosyne! It is nice to see being the part of our community. In order to log in to your account, you need to set up MFA and set of recovery keys if you have not done it while confirmation. Click the button below to continue.';
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
