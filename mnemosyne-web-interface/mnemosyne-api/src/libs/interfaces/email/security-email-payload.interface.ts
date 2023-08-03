import { UserInfoInterface } from '@interfaces/user-info.interface';
import { LANGUAGE_TYPES } from '@interfaces/language.types';

export interface SecurityEmailPayloadInterface {
  userInfo: UserInfoInterface;
  link: string;
  language: LANGUAGE_TYPES;
}
