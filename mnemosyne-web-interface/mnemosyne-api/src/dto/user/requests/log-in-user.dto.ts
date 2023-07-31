import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';

export class LogInUserDto {
  @Matches(EmailRegex, { message: 'wrong-email-format' })
  readonly email: string;

  @Matches(PasswordRegex, { message: 'wrong-password-format' })
  readonly password: string;

  @IsOptional()
  @IsString({ message: 'wrong-phone-code-format' })
  @Length(6, 6, { message: 'phone-code-should-be-6-digit-code' })
  readonly phoneCode: string;

  @IsOptional()
  @IsString({ message: 'wrong-mfa-code-format' })
  @Length(6, 6, { message: 'mfa-code-should-be-6-digit-code' })
  readonly mfaCode: string;
}
