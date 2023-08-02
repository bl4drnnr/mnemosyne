import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PhoneRegex } from '@regex/phone.regex';
import { LANGUAGE_TYPES } from '@interfaces/language.types';

export class RegistrationSendSmsCodeDto {
  @IsString({ message: 'wrong-phone-format' })
  @Matches(PhoneRegex, { message: 'wrong-phone-format' })
  readonly phone: string;

  @IsOptional()
  @IsEnum(LANGUAGE_TYPES)
  readonly language: LANGUAGE_TYPES;
}
