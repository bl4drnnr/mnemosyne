import { IsOptional, IsString, Matches } from 'class-validator';
import { PhoneRegex } from '@regex/phone.regex';
import { PasswordRegex } from '@regex/password.regex';
import { EmailRegex } from '@regex/email.regex';

export class VerifyMobilePhoneDto {
  @IsString({ message: 'wrong-phone-format' })
  @Matches(PhoneRegex, { message: 'wrong-phone-format' })
  readonly phone: string;

  @IsString({ message: 'mfa-code-should-be-6-digit-code' })
  @Matches(PhoneRegex, { message: 'mfa-code-should-be-6-digit-code' })
  readonly code: string;

  @IsOptional()
  @Matches(EmailRegex, { message: 'wrong-email-format' })
  readonly email: string;

  @IsOptional()
  @Matches(PasswordRegex, { message: 'wrong-password-format' })
  readonly password: string;
}
