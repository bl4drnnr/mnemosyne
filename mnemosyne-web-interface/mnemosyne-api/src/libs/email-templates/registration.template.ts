import { Language } from '@interfaces/language.enum';
import { defaultSecurityTemplate } from '@email-templates/default-security.template';
import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';

export const registrationTemplate = ({
  userInfo,
  link,
  language
}: SecurityPayloadInterface) => {
  let title: string;
  let content: string;
  let button: string;

  switch (language) {
    case Language.EN:
      title = `Welcome, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Thank you for choosing to be the part of our community. Click on the link below to complete registration and set up your profile, as well as configure your security settings and recovery keys.';
      button = 'Complete registration';
      break;
    case Language.RU:
      title = `Добро пожаловать, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Благодарим за то, что решили стать частью нашего сообщества. Нажмите на ссылку ниже, чтобы завершить регистрацию и настроить свой профиль, а также сконфигурировать настройки безопасности и ключи восстановления.';
      button = 'Завершить регистрацию';
      break;
    case Language.PL:
      title = `Witaj, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Dziękujemy za wybór bycia częścią naszej społeczności. Kliknij poniższy link, aby zakończyć rejestrację i skonfigurować swój profil, a także skonfigurować ustawienia zabezpieczeń i klucze odzyskiwania.';
      button = 'Dokończ rejestrację';
      break;
    default:
      title = `Welcome, ${userInfo.firstName} ${userInfo.lastName}!`;
      content =
        'Thank you for choosing to be the part of our community. Click on the link below to complete registration and set up your profile, as well as configure your security settings and recovery keys.';
      button = 'Complete registration';
      break;
  }

  return defaultSecurityTemplate({
    title,
    content,
    button,
    link
  });
};
