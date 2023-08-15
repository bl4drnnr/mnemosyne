import { UserInfoInterface } from '@interfaces/user-info.interface';
import { Language } from '@interfaces/language.enum';

export interface SecurityEmailPayloadInterface {
  userInfo: UserInfoInterface;
  link: string;
  language: Language;
}
