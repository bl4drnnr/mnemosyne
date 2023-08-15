import { UserInfoInterface } from '@interfaces/user-info.interface';
import { Language } from '@interfaces/language.enum';

export interface CompletedSecurityEmailInterface {
  to: string;
  userInfo: UserInfoInterface;
  language?: Language;
}
