import { IsOptional, IsString, Matches } from 'class-validator';
import { PhoneRegex } from '@regex/phone.regex';
import { PasswordRegex } from '@regex/password.regex';
import { EmailRegex } from '@regex/email.regex';
import { MfaCodeRegex } from '@regex/mfa-code.regex';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class VerifyMobilePhoneDto {
  @IsString({ message: ValidationErrorEnum.WRONG_PHONE_FORMAT })
  @Matches(PhoneRegex, { message: ValidationErrorEnum.WRONG_PHONE_FORMAT })
  readonly phone: string;

  @IsString({ message: ValidationErrorEnum.WRONG_MFA_CODE_FORMAT })
  @Matches(MfaCodeRegex, { message: ValidationErrorEnum.WRONG_MFA_CODE_FORMAT })
  readonly code: string;

  @IsOptional()
  @Matches(EmailRegex, { message: ValidationErrorEnum.WRONG_EMAIL_FORMAT })
  readonly email: string;

  @IsOptional()
  @Matches(PasswordRegex, {
    message: ValidationErrorEnum.WRONG_PASSWORD_FORMAT
  })
  readonly password: string;
}
