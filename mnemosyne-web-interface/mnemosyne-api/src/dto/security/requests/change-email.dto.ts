import { IsEnum, IsOptional, Matches } from 'class-validator';
import { Language } from '@interfaces/language.enum';
import { EmailRegex } from '@regex/email.regex';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class ChangeEmailDto {
  @Matches(EmailRegex, { message: ValidationErrorEnum.WRONG_EMAIL_FORMAT })
  readonly newEmail: string;

  @IsOptional()
  @IsEnum(Language)
  readonly language: Language;
}
