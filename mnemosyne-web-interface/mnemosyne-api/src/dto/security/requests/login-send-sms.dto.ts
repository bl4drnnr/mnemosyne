import { IsEnum, IsOptional, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';
import { Language } from '@interfaces/language.enum';
import { ValidationError } from '@interfaces/validation-error.enum';

export class LoginSendSmsDto {
  @Matches(EmailRegex, { message: ValidationError.WRONG_EMAIL_FORMAT })
  readonly email: string;

  @Matches(PasswordRegex, {
    message: ValidationError.WRONG_PASSWORD_FORMAT
  })
  readonly password: string;

  @IsOptional()
  @IsEnum(Language)
  readonly language: Language;
}
