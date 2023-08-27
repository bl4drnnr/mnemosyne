import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { PasswordRegex } from '@regex/password.regex';
import { Language } from '@interfaces/language.enum';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class ConfirmCompanyAccDto {
  @IsOptional()
  @IsString({ message: ValidationErrorEnum.WRONG_FIRST_NAME_FORMAT })
  @Length(1, 64, { message: ValidationErrorEnum.WRONG_FIRST_NAME_LENGTH })
  readonly firstName: string;

  @IsOptional()
  @IsString({ message: ValidationErrorEnum.WRONG_LAST_NAME_FORMAT })
  @Length(1, 64, { message: ValidationErrorEnum.WRONG_LAST_NAME_LENGTH })
  readonly lastName: string;

  @IsOptional()
  @Matches(PasswordRegex, {
    message: ValidationErrorEnum.WRONG_PASSWORD_FORMAT
  })
  readonly password: string;

  @IsOptional()
  @IsEnum(Language)
  readonly language: Language;
}
