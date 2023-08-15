import { IsEnum, IsOptional, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';
import { Language } from '@interfaces/language.enum';

export class LoginSendSmsDto {
  @Matches(EmailRegex, { message: 'wrong-email-format' })
  readonly email: string;

  @Matches(PasswordRegex, { message: 'wrong-password-format' })
  readonly password: string;

  @IsOptional()
  @IsEnum(Language)
  readonly language: Language;
}
