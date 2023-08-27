import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PhoneRegex } from '@regex/phone.regex';
import { Language } from '@interfaces/language.enum';
import { ValidationError } from '@interfaces/validation-error.enum';

export class RegistrationSendSmsCodeDto {
  @IsString({ message: ValidationError.WRONG_PHONE_FORMAT })
  @Matches(PhoneRegex, { message: ValidationError.WRONG_PHONE_FORMAT })
  readonly phone: string;

  @IsOptional()
  @IsEnum(Language)
  readonly language: Language;
}
