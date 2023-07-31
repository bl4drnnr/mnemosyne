import {
  IsBoolean,
  IsEnum,
  IsFQDN,
  IsOptional,
  IsString,
  Length,
  Matches
} from 'class-validator';
import { LANGUAGE_TYPES } from '@interfaces/language.types';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';

export class CreateUserDto {
  @Matches(EmailRegex, { message: 'wrong-email-format' })
  readonly email: string;

  @Matches(PasswordRegex, { message: 'wrong-password-format' })
  readonly password: string;

  @IsString({ message: 'wrong-first-name-format' })
  @Length(1, 64, { message: 'wrong-first-name-length' })
  readonly firstName: string;

  @IsString({ message: 'wrong-last-name-format' })
  @Length(1, 64, { message: 'wrong-last-name-length' })
  readonly lastName: string;

  @IsOptional()
  @IsString({ message: 'wrong-location-format' })
  @Length(8, 128, { message: 'wrong-location-length' })
  readonly location: string;

  @IsOptional()
  @IsString({ message: 'wrong-company-format' })
  @Length(2, 64, { message: 'wrong-company-length' })
  readonly company: string;

  @IsOptional()
  @IsString({ message: 'wrong-fqdn' })
  @IsFQDN()
  readonly website: string;

  @IsBoolean()
  readonly tac: boolean;

  @IsOptional()
  @IsEnum(LANGUAGE_TYPES)
  readonly language: LANGUAGE_TYPES;
}
