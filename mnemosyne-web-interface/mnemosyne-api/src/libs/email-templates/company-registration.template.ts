import { Language } from '@interfaces/language.enum';
import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';
import { companySecurityTemplate } from '@email-templates/company/company-security.template';

export const companyRegistrationTemplate = ({
  companyInfo,
  link,
  language
}: SecurityPayloadInterface) => {
  const username = companyInfo.companyOwnerEmail.split('@')[0];
  let title: string;
  let content: string;
  let button: string;
  let companyNameTitle: string;
  let companyLocationTitle: string;
  let companyWebsiteTitle: string;
  let companyOwnerTitle: string;

  switch (language) {
    case Language.EN:
      title = `Welcome, ${username}`;
      content =
        "Thank you for choosing to be the part of our community. It seems like you want to create a company/organization and be able to invite other users, huh? Not a big deal! Click the button below in order to set up company account. You will be requested to set up the password, personal data and recovery keys of owner's account. Company data can be changed later on.";
      button = 'Complete registration';
      companyNameTitle = 'Company name';
      companyLocationTitle = 'Company location';
      companyWebsiteTitle = 'Company website';
      companyOwnerTitle = 'Company account owner email address';
      break;
    case Language.RU:
      title = `Добро пожаловать, ${username}`;
      content =
        'Спасибо, что решили стать частью нашего сообщества. Кажется, вы хотите создать компанию/организацию и иметь возможность приглашать других пользователей, да? Не ахти какое дело! Нажмите кнопку ниже, чтобы настроить учетную запись компании. Вам будет предложено установить пароль, личные данные и ключи восстановления учетной записи владельца. Данные компании могут быть изменены позже.';
      button = 'Завершить регистрацию';
      companyNameTitle = 'Название компании';
      companyLocationTitle = 'Местонахождение компании';
      companyWebsiteTitle = 'Веб-сайт компании';
      companyOwnerTitle =
        'Адрес электронной почты владельца учетной записи компании';
      break;
    case Language.PL:
      title = `Witaj, ${username}`;
      content =
        'Dziękujemy, że zdecydowałeś się być częścią naszej społeczności. Wygląda na to, że chcesz stworzyć firmę/organizację i mieć możliwość zapraszania innych użytkowników, co? Nic takiego! Kliknij przycisk poniżej, aby założyć konto firmowe. Zostaniesz poproszony o ustawienie hasła, danych osobowych i kluczy odzyskiwania konta właściciela. Dane firmy można później zmienić.';
      button = 'Dokończ rejestrację';
      companyNameTitle = 'Nazwa firmy';
      companyLocationTitle = 'Lokalizacja firmy';
      companyWebsiteTitle = 'Strona internetowa firmy';
      companyOwnerTitle = 'Adres e-mail właściciela konta firmowego';
      break;
    default:
      title = `Welcome, ${username}`;
      content =
        "Thank you for choosing to be the part of our community. It seems like you want to create a company/organization and be able to invite other users, huh? Not a big deal! Click the button below in order to set up company account. You will be requested to set up the password, personal data and recovery keys of owner's account. Company data can be changed later on.";
      button = 'Complete registration';
      companyNameTitle = 'Company name';
      companyLocationTitle = 'Company location';
      companyWebsiteTitle = 'Company website';
      companyOwnerTitle = 'Company account owner email address';
      break;
  }

  return companySecurityTemplate({
    title,
    content,
    button,
    link,
    companyNameTitle,
    companyLocationTitle,
    companyWebsiteTitle,
    companyOwnerTitle,
    companyInfo
  });
};
