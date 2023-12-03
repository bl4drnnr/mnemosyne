import { CompanyPayloadInterface } from '@interfaces/company-payload.interface';
import { Language } from '@interfaces/language.enum';
import { companyNotificationTemplate } from '@email-templates/company/company-notification.template';

export const companyMemberDeletedTemplate = ({
  language,
  performedBy,
  companyName
}: CompanyPayloadInterface) => {
  let title: string;
  let content: string;
  let performedByTitle: string;

  switch (language) {
    case Language.EN:
      title = `Last letter from ${companyName}`;
      content = `We are very sorry, but you have been deleted from the ${companyName} company. It means that you have lost the access to the company and all its assets and information along with your previous access level. Your account has not been deleted so feel free to log in back and use your account. The deletion action has been performed by ${performedBy}.`;
      performedByTitle = 'Action has been performed by';
      break;
    case Language.RU:
      title = `Последнее письмо от ${companyName}`;
      content = `Нам очень жаль, но вы были удалены из компании ${companyName}. Это означает, что вы потеряли доступ к компании, всем ее активам и информации вместе с предыдущим уровнем доступа. Ваша учетная запись не была удалена, поэтому не стесняйтесь войти в систему и использовать свою учетную запись. Действие удаления было выполнено ${performedBy}.`;
      performedByTitle = 'Действие выполнил';
      break;
    case Language.PL:
      title = `Ostatni list od ${companyName}`;
      content = `Bardzo nam przykro, ale zostałeś usunięty z firmy ${companyName}. Oznacza to, że utraciłeś dostęp do firmy i wszystkich jej aktywów oraz informacji wraz z dotychczasowym poziomem dostępu. Twoje konto nie zostało usunięte, więc możesz zalogować się ponownie i korzystać ze swojego konta. Akcja usuwania została wykonana przez ${performedBy}.`;
      performedByTitle = 'Akcję wykonał';
      break;
    default:
      title = `Last letter from ${companyName}`;
      content = `We are very sorry, but you have been deleted from the ${companyName} company. It means that you have lost the access to the company and all its assets and information along with your previous access level. Your account has not been deleted so feel free to log in back and use your account. The deletion action has been performed by ${performedBy}.`;
      performedByTitle = 'Action has been performed by';
      break;
  }

  return companyNotificationTemplate({
    title,
    content,
    performedBy,
    performedByTitle
  });
};
