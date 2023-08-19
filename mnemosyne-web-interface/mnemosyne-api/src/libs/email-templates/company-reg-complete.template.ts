import { Language } from '@interfaces/language.enum';
import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';
import { companySecurityTemplate } from '@email-templates/company/company-security.template';

export const companyRegCompleteTemplate = ({
  companyInfo,
  link,
  language
}: SecurityPayloadInterface) => {
  let title: string;
  let content: string;
  let button: string;
  let companyNameTitle: string;
  let companyLocationTitle: string;
  let companyWebsiteTitle: string;
  let companyOwnerTitle: string;

  switch (language) {
    case Language.EN:
      title = `Greetings, ${companyInfo.companyName}`;
      content =
        'We are incredibly happy that you have decided to become a user of our product. Below will be the company data that you specified during registration. You can change this information at any time after verifying the company account and configuring the owner account. Glad to see you!';
      button = "Let's start!";
      companyNameTitle = 'Company name';
      companyLocationTitle = 'Company location';
      companyWebsiteTitle = 'Company website';
      companyOwnerTitle = 'Company account owner email address';
      break;
    case Language.RU:
      title = `Приветствуйте, ${companyInfo.companyName}`;
      content =
        'Мы невероятно рады тому, что вы решили стать пользователем нашего продукта. Внизу будут находиться данные компании, которые вы указали во время регистрации. Вы можете изменить эти данные в любой момент после того, как подтвердить аккаунт компании и сконфигурируете аккаунт владельца. Рады вас видеть!';
      button = 'Начинаем!';
      companyNameTitle = 'Название компании';
      companyLocationTitle = 'Местонахождение компании';
      companyWebsiteTitle = 'Веб-сайт компании';
      companyOwnerTitle =
        'Адрес электронной почты владельца учетной записи компании';
      break;
    case Language.PL:
      title = `Pozdrowienia, ${companyInfo.companyName};`;
      content =
        'Niezmiernie się cieszymy, że zdecydowałeś się zostać użytkownikiem naszego produktu. Poniżej znajdują się dane firmy, które podałeś podczas rejestracji. Możesz zmienić te informacje w dowolnym momencie po zweryfikowaniu konta firmowego i skonfigurowaniu konta właściciela. Cieszę się że cię widzę!';
      button = 'Zaczynamy!';
      companyNameTitle = 'Nazwa firmy';
      companyLocationTitle = 'Lokalizacja firmy';
      companyWebsiteTitle = 'Strona internetowa firmy';
      companyOwnerTitle = 'Adres e-mail właściciela konta firmowego';
      break;
    default:
      title = `Greetings, ${companyInfo.companyName}`;
      content =
        'We are incredibly happy that you have decided to become a user of our product. Below will be the company data that you specified during registration. You can change this information at any time after verifying the company account and configuring the owner account. Glad to see you!';
      button = "Let's start!";
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
