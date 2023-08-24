import { Language } from '@interfaces/language.enum';
import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';
import { defaultSecurityTemplate } from '@email-templates/default-security.template';

export const companyMemberConfirmInviteTemplate = ({
  link,
  companyName,
  language
}: SecurityPayloadInterface) => {
  let title: string;
  let content: string;
  let button: string;

  switch (language) {
    case Language.EN:
      title = `Welcome to ${companyName}`;
      content = `You have successfully confirmed the membership in the ${companyName}. In order to log in to your company and get access to the company data, click the button below and log in to your account.`;
      button = 'Log in to org';
      break;
    case Language.RU:
      title = `Добро пожаловать в ${companyName}`;
      content = `Вы успешно подтвердили членство в ${companyName}. Чтобы войти в свою компанию и получить доступ к данным компании, нажмите кнопку ниже и войдите в свою учетную запись.`;
      button = 'Войти в организацию';
      break;
    case Language.PL:
      title = `Witamy w ${companyName}`;
      content = `Pomyślnie potwierdziłeś członkostwo w firmie ${companyName}. Aby zalogować się do swojej firmy i uzyskać dostęp do danych firmy kliknij przycisk poniżej i zaloguj się na swoje konto.`;
      button = 'Zaloguj się do firmy';
      break;
    default:
      title = `Welcome to ${companyName}`;
      content = `You have successfully confirmed the membership in the ${companyName}. In order to log in to your company and get access to the company data, click the button below and log in to your account.`;
      button = 'Log in to org';
      break;
  }

  return defaultSecurityTemplate({
    title,
    content,
    button,
    link
  });
};
