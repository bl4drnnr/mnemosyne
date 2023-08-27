import { IsOptional, Matches } from 'class-validator';
import { PasswordRegex } from '@regex/password.regex';
import { MfaCodeRegex } from '@regex/mfa-code.regex';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class ChangePasswordDto {
  @Matches(PasswordRegex, {
    message: ValidationErrorEnum.WRONG_PASSWORD_FORMAT
  })
  readonly currentPassword: string;

  @Matches(PasswordRegex, {
    message: ValidationErrorEnum.WRONG_PASSWORD_FORMAT
  })
  readonly newPassword: string;

  @IsOptional()
  @Matches(MfaCodeRegex, { message: ValidationErrorEnum.WRONG_MFA_CODE_FORMAT })
  readonly mfaCode: string;

  @IsOptional()
  @Matches(MfaCodeRegex, {
    message: ValidationErrorEnum.WRONG_PHONE_CODE_FORMAT
  })
  readonly phoneCode: string;
}
