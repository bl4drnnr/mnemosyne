import { IsOptional, Matches } from 'class-validator';
import { PasswordRegex } from '@regex/password.regex';
import { MfaCodeRegex } from '@regex/mfa-code.regex';

export class ChangePasswordDto {
  @Matches(PasswordRegex, { message: 'wrong-password-format' })
  readonly currentPassword: string;

  @Matches(PasswordRegex, { message: 'wrong-password-format' })
  readonly newPassword: string;

  @IsOptional()
  @Matches(MfaCodeRegex, { message: 'mfa-code-should-be-6-digit-code' })
  readonly mfaCode: string;

  @IsOptional()
  @Matches(MfaCodeRegex, { message: 'phone-code-should-be-6-digit-code' })
  readonly phoneCode: string;
}
