import { UserInfoInterface } from '@interfaces/user-info.interface';
import { LanguageEnum } from '@interfaces/language.enum';

export interface CompletedSecurityEmailInterface {
  to: string;
  userInfo: UserInfoInterface;
  language?: LanguageEnum;
}
