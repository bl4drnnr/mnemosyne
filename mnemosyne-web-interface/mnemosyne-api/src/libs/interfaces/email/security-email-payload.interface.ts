import { UserInfoInterface } from '@interfaces/user-info.interface';
import { LanguageEnum } from '@interfaces/language.enum';

export interface SecurityEmailPayloadInterface {
  userInfo: UserInfoInterface;
  link: string;
  language: LanguageEnum;
}
