import { IsString, Length, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class LoginGenerateRecoveryKeysDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PASSPHRASE_DESC,
    example: DocsProperty.PASSPHRASE_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_PASSPHRASE_FORMAT })
  @Length(8, 128, { message: ValidationError.WRONG_PASSPHRASE_LENGTH })
  readonly passphrase: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  @Matches(EmailRegex, { message: ValidationError.WRONG_EMAIL_FORMAT })
  readonly email: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.PASSWORD_DESC,
    example: DocsProperty.PASSWORD_EXAMPLE
  })
  @Matches(PasswordRegex, {
    message: ValidationError.WRONG_PASSWORD_FORMAT
  })
  readonly password: string;
}
