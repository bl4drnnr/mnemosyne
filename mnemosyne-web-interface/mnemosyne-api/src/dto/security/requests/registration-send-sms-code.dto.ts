import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PhoneRegex } from '@regex/phone.regex';
import { Language } from '@interfaces/language.enum';

export class RegistrationSendSmsCodeDto {
  @IsString({ message: 'wrong-phone-format' })
  @Matches(PhoneRegex, { message: 'wrong-phone-format' })
  readonly phone: string;

  @IsOptional()
  @IsEnum(Language)
  readonly language: Language;
}
