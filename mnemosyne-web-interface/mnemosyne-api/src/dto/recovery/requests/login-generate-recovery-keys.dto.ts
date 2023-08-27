import { IsString, Length, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class LoginGenerateRecoveryKeysDto {
  @IsString({ message: ValidationErrorEnum.WRONG_PASSPHRASE_FORMAT })
  @Length(8, 128, { message: ValidationErrorEnum.WRONG_PASSPHRASE_LENGTH })
  readonly passphrase: string;

  @Matches(EmailRegex, { message: ValidationErrorEnum.WRONG_EMAIL_FORMAT })
  readonly email: string;

  @Matches(PasswordRegex, {
    message: ValidationErrorEnum.WRONG_PASSWORD_FORMAT
  })
  readonly password: string;
}
