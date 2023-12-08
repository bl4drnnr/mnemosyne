import { CompanyPayloadInterface } from '@interfaces/company-payload.interface';
import { Language } from '@interfaces/language.enum';
import { companyNotificationTemplate } from '@email-templates/company/company-notification.template';

export const companyDeletionTemplate = ({
  language,
  performedBy,
  companyName
}: CompanyPayloadInterface) => {
  let title: string;
  let content: string;
  let performedByTitle: string;

  switch (language) {
    case Language.EN:
      title = `The very last letter from ${companyName}`;
      content = `We are unbelievably sorry to say that, but it looks like that this is when ${companyName} is over... :( Company has been deleted and therefore you have been removed from the company, but don't worry about your account, as previously, you will be able to log in to your account and even invited to the new company, so, our journey only has started!`;
      performedByTitle = 'Action has been performed by';
      break;
    case Language.RU:
      title = `Самое последнее письмо от ${companyName}`;
      content = `Нам невероятно жаль это говорить, но похоже, что настал момент, когда история ${companyName} закончилась... :( Компания была удалена, и, следовательно, вы были удалены из компании, но не беспокойтесь о ваш аккаунт, как и раньше, вы сможете войти в свой аккаунт и даже пригласить в новую компанию, а значит, наше путешествие только началось!`;
      performedByTitle = 'Действие выполнил';
      break;
    case Language.PL:
      title = `Ostatni list od ${companyName}`;
      content = `Niesamowicie przykro nam to mówić, ale wygląda na to, że to już koniec ${companyName}... :( Firma została usunięta i dlatego też zostałeś usunięty z firmy, ale nie martw się o to swoje konto, tak jak poprzednio, będziesz mógł zalogować się na swoje konto, a nawet zostać zaproszonym do nowej firmy, więc nasza podróż dopiero się zaczęła!`;
      performedByTitle = 'Akcję wykonał';
      break;
    default:
      title = `The very last letter from ${companyName}`;
      content = `We are unbelievably sorry to say that, but it looks like that this is when ${companyName} is over... :( Company has been deleted and therefore you have been removed from the company, but don't worry about your account, as previously, you will be able to log in to your account and even invited to the new company, so, our journey only has started!`;
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
