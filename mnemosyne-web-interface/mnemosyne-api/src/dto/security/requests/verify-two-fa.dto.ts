import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';
import { MfaCodeRegex } from '@regex/mfa-code.regex';

export class VerifyTwoFaDto {
  @Matches(MfaCodeRegex, { message: 'mfa-code-should-be-6-digit-code' })
  readonly code: string;

  @IsString({ message: 'wrong-two-fa-token-format' })
  @Length(32, 32, { message: 'wrong-two-fa-token-length' })
  readonly twoFaToken: string;

  @IsOptional()
  @Matches(EmailRegex, { message: 'wrong-email-format' })
  readonly email: string;

  @IsOptional()
  @Matches(PasswordRegex, { message: 'wrong-password-format' })
  readonly password: string;
}
