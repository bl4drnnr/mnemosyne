import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PhoneRegex } from '@regex/phone.regex';
import { LanguageEnum } from '@interfaces/language.enum';

export class RegistrationSendSmsCodeDto {
  @IsString({ message: 'wrong-phone-format' })
  @Matches(PhoneRegex, { message: 'wrong-phone-format' })
  readonly phone: string;

  @IsOptional()
  @IsEnum(LanguageEnum)
  readonly language: LanguageEnum;
}
