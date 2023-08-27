import { IsEnum, IsOptional, Matches } from 'class-validator';
import { PasswordRegex } from '@regex/password.regex';
import { MfaCodeRegex } from '@regex/mfa-code.regex';
import { Language } from '@interfaces/language.enum';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class ConfirmEmailChangeDto {
  @IsOptional()
  @Matches(PasswordRegex, {
    message: ValidationErrorEnum.WRONG_PASSWORD_FORMAT
  })
  readonly password: string;

  @IsOptional()
  @Matches(MfaCodeRegex, { message: ValidationErrorEnum.WRONG_MFA_CODE_FORMAT })
  readonly mfaCode: string;

  @IsOptional()
  @Matches(MfaCodeRegex, {
    message: ValidationErrorEnum.WRONG_PHONE_CODE_FORMAT
  })
  readonly phoneCode: string;

  @IsOptional()
  @IsEnum(Language)
  readonly language: Language;
}
