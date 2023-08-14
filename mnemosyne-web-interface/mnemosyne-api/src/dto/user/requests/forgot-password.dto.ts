import { IsEnum, IsOptional, Matches } from 'class-validator';
import { LanguageEnum } from '@interfaces/language.enum';
import { EmailRegex } from '@regex/email.regex';

export class ForgotPasswordDto {
  @Matches(EmailRegex, { message: 'wrong-email-format' })
  readonly email: string;

  @IsOptional()
  @IsEnum(LanguageEnum)
  readonly language: LanguageEnum;
}
