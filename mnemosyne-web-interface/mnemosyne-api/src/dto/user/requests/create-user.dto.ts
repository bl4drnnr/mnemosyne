import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches
} from 'class-validator';
import { Language } from '@interfaces/language.enum';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class CreateUserDto {
  @Matches(EmailRegex, { message: ValidationErrorEnum.WRONG_EMAIL_FORMAT })
  readonly email: string;

  @Matches(PasswordRegex, {
    message: ValidationErrorEnum.WRONG_PASSWORD_FORMAT
  })
  readonly password: string;

  @IsString({ message: ValidationErrorEnum.WRONG_FIRST_NAME_FORMAT })
  @Length(1, 64, { message: ValidationErrorEnum.WRONG_FIRST_NAME_LENGTH })
  readonly firstName: string;

  @IsString({ message: ValidationErrorEnum.WRONG_LAST_NAME_FORMAT })
  @Length(1, 64, { message: ValidationErrorEnum.WRONG_LAST_NAME_LENGTH })
  readonly lastName: string;

  @IsBoolean()
  readonly tac: boolean;

  @IsOptional()
  @IsEnum(Language)
  readonly language: Language;
}
