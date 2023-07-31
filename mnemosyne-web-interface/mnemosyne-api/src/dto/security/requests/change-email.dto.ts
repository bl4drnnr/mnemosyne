import { IsEnum, IsOptional, Matches } from 'class-validator';
import { LANGUAGE_TYPES } from '@interfaces/language.types';

export class ChangeEmailDto {
  @Matches(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    { message: 'wrong-email-format' }
  )
  readonly newEmail: string;

  @IsOptional()
  @IsEnum(LANGUAGE_TYPES)
  readonly language: LANGUAGE_TYPES;
}
