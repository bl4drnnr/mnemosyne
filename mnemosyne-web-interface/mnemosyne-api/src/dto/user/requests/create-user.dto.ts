import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches
} from 'class-validator';
import { LanguageEnum } from '@interfaces/language.enum';
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

  @IsBoolean()
  readonly tac: boolean;

  @IsOptional()
  @IsEnum(LanguageEnum)
  readonly language: LanguageEnum;
}
