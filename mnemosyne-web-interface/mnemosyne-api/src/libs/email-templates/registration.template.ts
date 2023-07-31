import { UserInfoInterface } from '@interfaces/user-info.interface';
import { LANGUAGE_TYPES } from '@interfaces/language.types';
import { defaultSecurityTemplate } from '@email-templates/default-security.template';

export const registrationTemplate = ({
  userInfo,
  confirmationLink,
  language
}: {
  userInfo: UserInfoInterface;
  confirmationLink: string;
  language: LANGUAGE_TYPES;
}) => {
  let welcomeTitle: string;
  let registrationPayload: string;
  let confirmAccButton: string;

  switch (language) {
    case LANGUAGE_TYPES.EN:
      welcomeTitle = `Welcome, ${userInfo.firstName} ${userInfo.lastName}!`;
      registrationPayload =
        'Thank you for choosing to be part of our community. Click on the link below to complete registration and set up your profile, as well as configure your security settings and recovery keys.';
      confirmAccButton = 'Complete registration';
      break;
    case LANGUAGE_TYPES.RU:
      welcomeTitle = `Добро пожаловать, ${userInfo.firstName} ${userInfo.lastName}!`;
      registrationPayload =
        'Благодарим за то, что решили стать частью нашего сообщества. Нажмите на ссылку ниже, чтобы завершить регистрацию и настроить свой профиль, а также сконфигурировать настройки безопасности и ключи восстановления.';
      confirmAccButton = 'Завершить регистрацию';
      break;
    case LANGUAGE_TYPES.PL:
      welcomeTitle = `Witaj, ${userInfo.firstName} ${userInfo.lastName}!`;
      registrationPayload =
        'Dziękujemy za wybór bycia częścią naszej społeczności. Kliknij poniższy link, aby zakończyć rejestrację i skonfigurować swój profil, a także skonfigurować ustawienia zabezpieczeń i klucze odzyskiwania.';
      confirmAccButton = 'Dokończ rejestrację';
      break;
    default:
      welcomeTitle = `Welcome, ${userInfo.firstName} ${userInfo.lastName}!`;
      registrationPayload =
        'Thank you for choosing to be part of our community. Click on the link below to complete registration and set up your profile, as well as configure your security settings and recovery keys.';
      confirmAccButton = 'Complete registration';
      break;
  }

  return defaultSecurityTemplate({
    title: welcomeTitle,
    content: registrationPayload,
    button: confirmAccButton,
    link: confirmationLink
  });
};
