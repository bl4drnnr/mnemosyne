import { IsEnum, IsOptional, Matches } from 'class-validator';
import { LANGUAGE_TYPES } from '@interfaces/language.types';
import { EmailRegex } from '@regex/email.regex';

export class ChangeEmailDto {
  @Matches(EmailRegex, { message: 'wrong-email-format' })
  readonly newEmail: string;

  @IsOptional()
  @IsEnum(LANGUAGE_TYPES)
  readonly language: LANGUAGE_TYPES;
}
