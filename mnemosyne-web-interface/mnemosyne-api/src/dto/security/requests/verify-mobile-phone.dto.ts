import { IsOptional, IsString, Matches } from 'class-validator';
import { PhoneRegex } from '@regex/phone.regex';
import { PasswordRegex } from '@regex/password.regex';
import { EmailRegex } from '@regex/email.regex';
import { MfaCodeRegex } from '@regex/mfa-code.regex';
import { ValidationError } from '@interfaces/validation-error.enum';

export class VerifyMobilePhoneDto {
  @IsString({ message: ValidationError.WRONG_PHONE_FORMAT })
  @Matches(PhoneRegex, { message: ValidationError.WRONG_PHONE_FORMAT })
  readonly phone: string;

  @IsString({ message: ValidationError.WRONG_MFA_CODE_FORMAT })
  @Matches(MfaCodeRegex, { message: ValidationError.WRONG_MFA_CODE_FORMAT })
  readonly code: string;

  @IsOptional()
  @Matches(EmailRegex, { message: ValidationError.WRONG_EMAIL_FORMAT })
  readonly email: string;

  @IsOptional()
  @Matches(PasswordRegex, {
    message: ValidationError.WRONG_PASSWORD_FORMAT
  })
  readonly password: string;
}
