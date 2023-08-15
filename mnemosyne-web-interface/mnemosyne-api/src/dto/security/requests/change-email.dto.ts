import { IsEnum, IsOptional, Matches } from 'class-validator';
import { Language } from '@interfaces/language.enum';
import { EmailRegex } from '@regex/email.regex';

export class ChangeEmailDto {
  @Matches(EmailRegex, { message: 'wrong-email-format' })
  readonly newEmail: string;

  @IsOptional()
  @IsEnum(Language)
  readonly language: Language;
}
