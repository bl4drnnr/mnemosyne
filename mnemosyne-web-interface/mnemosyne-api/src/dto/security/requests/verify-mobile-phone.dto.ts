import { IsOptional, IsString, Matches } from 'class-validator';
import { PhoneRegex } from '@regex/phone.regex';
import { PasswordRegex } from '@regex/password.regex';
import { EmailRegex } from '@regex/email.regex';
import { MfaCodeRegex } from '@regex/mfa-code.regex';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class VerifyMobilePhoneDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PHONE_DESC,
    example: DocsProperty.PHONE_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_PHONE_FORMAT })
  @Matches(PhoneRegex, { message: ValidationError.WRONG_PHONE_FORMAT })
  readonly phone: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.AUTH_MFA_CODE_DESC,
    example: DocsProperty.MFA_CODE_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_MFA_CODE_FORMAT })
  @Matches(MfaCodeRegex, { message: ValidationError.WRONG_MFA_CODE_FORMAT })
  readonly code: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  @ApiPropertyOptional()
  @IsOptional()
  @Matches(EmailRegex, { message: ValidationError.WRONG_EMAIL_FORMAT })
  readonly email?: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.PASSWORD_DESC,
    example: DocsProperty.PASSWORD_EXAMPLE
  })
  @ApiPropertyOptional()
  @IsOptional()
  @Matches(PasswordRegex, {
    message: ValidationError.WRONG_PASSWORD_FORMAT
  })
  readonly password?: string;
}
