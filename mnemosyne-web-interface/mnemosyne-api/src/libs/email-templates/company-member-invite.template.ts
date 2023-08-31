import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';
import { Language } from '@interfaces/language.enum';
import { companySecurityTemplate } from '@email-templates/company/company-security.template';

export const companyMemberInviteTemplate = ({
  userInfo,
  companyInfo,
  link,
  language
}: SecurityPayloadInterface) => {
  const username = userInfo.email.split('@')[0];
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
      content = `Congratulations! You have been invited to join ${companyInfo.companyName} organization at Mnemosyne. If order to continue and accept invitation, please, click the button below. If you already have account, you will just join the company. Otherwise, you will have to create an account by setting up the password, personal info and recovery keys.`;
      button = 'Complete registration';
      companyNameTitle = 'Company name';
      companyLocationTitle = 'Company location';
      companyWebsiteTitle = 'Company website';
      companyOwnerTitle = 'Company account owner email address';
      break;
    case Language.RU:
      title = `Добро пожаловать, ${username}`;
      content = `Поздравляем! Вас пригласили присоединиться к организации ${companyInfo.companyName} в Mnemosyne. Чтобы продолжить и принять приглашение, пожалуйста, нажмите кнопку ниже. Если у вас уже есть аккаунт, вы просто присоединитесь к компании. В противном случае вам придется создать учетную запись, установив пароль, личную информацию и ключи восстановления.`;
      button = 'Завершить регистрацию';
      companyNameTitle = 'Название компании';
      companyLocationTitle = 'Местонахождение компании';
      companyWebsiteTitle = 'Веб-сайт компании';
      companyOwnerTitle =
        'Адрес электронной почты владельца учетной записи компании';
      break;
    case Language.PL:
      title = `Witaj, ${username}`;
      content = `Gratulacje! Zaproszono Cię do dołączenia do organizacji ${companyInfo.companyName} w Mnemosyne. Jeśli chcesz kontynuować i zaakceptować zaproszenie, kliknij przycisk poniżej. Jeśli masz już konto, po prostu dołączysz do firmy. W przeciwnym razie będziesz musiał utworzyć konto, ustawiając hasło, dane osobowe i klucze odzyskiwania.`;
      button = 'Dokończ rejestrację';
      companyNameTitle = 'Nazwa firmy';
      companyLocationTitle = 'Lokalizacja firmy';
      companyWebsiteTitle = 'Strona internetowa firmy';
      companyOwnerTitle = 'Adres e-mail właściciela konta firmowego';
      break;
    default:
      title = `Welcome, ${username}`;
      content = `Congratulations! You have been invited to join ${companyInfo.companyName} organization at Mnemosyne. If order to continue and accept invitation, please, click the button below. If you already have account, you will just join the company. Otherwise, you will have to create an account by setting up the password, personal info and recovery keys.`;
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
    companyOwnerTitle,
    companyNameTitle,
    companyLocationTitle,
    companyWebsiteTitle,
    companyInfo,
    userInfo
  });
};
