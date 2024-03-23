import { ContactUsEmailInterface } from '@interfaces/contact-us-email.interface';
import { contactTemplate } from '@email-templates/common/contact.template';
import { Language } from '@interfaces/language.enum';

export const contactUsTemplate = ({
  from,
  message,
  language
}: ContactUsEmailInterface) => {
  let fromTitle: string;
  let messageTitle: string;
  let contactTitle: string;

  switch (language) {
    case Language.EN:
      fromTitle = 'From user';
      messageTitle = "User's message";
      contactTitle = 'User feedback';
      break;
    case Language.RU:
      fromTitle = 'От пользователя';
      messageTitle = 'Сообщение пользователя';
      contactTitle = 'Фидбек пользователя';
      break;
    case Language.PL:
      fromTitle = 'Od użytkownika';
      messageTitle = 'Wiadomość użytkownika';
      contactTitle = 'Feedback użytkownika';
      break;
    default:
      fromTitle = 'From user';
      messageTitle = "User's message";
      contactTitle = 'User feedback';
      break;
  }

  return contactTemplate({
    from,
    message,
    messageTitle,
    fromTitle,
    contactTitle
  });
};
