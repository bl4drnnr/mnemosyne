import { Language } from '@interfaces/language.enum';
import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';
import { companySecurityTemplate } from '@email-templates/company/company-security.template';

export const companyRegistrationTemplate = ({
  companyInfo,
  userInfo,
  link,
  language
}: SecurityPayloadInterface) => {
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

  return companySecurityTemplate({
    title,
    content,
    button,
    link,
    companyInfo
  });
};
