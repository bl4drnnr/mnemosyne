import { UserInfoInterface } from '@interfaces/user-info.interface';
import { LANGUAGE_TYPES } from '@interfaces/language.types';

export interface CompletedSecurityEmailInterface {
  to: string;
  userInfo: UserInfoInterface;
  language?: LANGUAGE_TYPES;
}
