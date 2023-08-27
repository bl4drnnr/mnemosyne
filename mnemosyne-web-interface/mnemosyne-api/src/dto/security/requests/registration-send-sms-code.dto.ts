import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PhoneRegex } from '@regex/phone.regex';
import { Language } from '@interfaces/language.enum';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class RegistrationSendSmsCodeDto {
  @IsString({ message: ValidationErrorEnum.WRONG_PHONE_FORMAT })
  @Matches(PhoneRegex, { message: ValidationErrorEnum.WRONG_PHONE_FORMAT })
  readonly phone: string;

  @IsOptional()
  @IsEnum(Language)
  readonly language: Language;
}
