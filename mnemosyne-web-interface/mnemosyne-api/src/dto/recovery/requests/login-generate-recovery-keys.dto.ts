import { IsString, Length, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';

export class LoginGenerateRecoveryKeysDto {
  @IsString({ message: 'wrong-passphrase-format' })
  @Length(8, 128, { message: 'wrong-passphrase-length' })
  readonly passphrase: string;

  @Matches(EmailRegex, { message: 'wrong-email-format' })
  readonly email: string;

  @Matches(PasswordRegex, { message: 'wrong-password-format' })
  readonly password: string;
}
