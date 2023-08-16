import { Language } from '@interfaces/language.enum';
import { defaultSecurityTemplate } from '@email-templates/default-security.template';
import { SecurityEmailPayloadInterface } from '@interfaces/security-email-payload.interface';

export const companyRegistrationTemplate = ({
  companyInfo,
  link,
  language
}: SecurityEmailPayloadInterface) => {
  let title: string;
  let content: string;
  let button: string;

  switch (language) {
    case Language.EN:
      title = '';
      content = '';
      button = '';
      break;
    case Language.RU:
      title = '';
      content = '';
      button = '';
      break;
    case Language.PL:
      title = '';
      content = '';
      button = '';
      break;
    default:
      title = '';
      content = '';
      button = '';
      break;
  }

  return defaultSecurityTemplate({
    title,
    content,
    button,
    link
  });
};
