import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';
import { MfaCodeRegex } from '@regex/mfa-code.regex';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class VerifyTwoFaDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.AUTH_MFA_CODE_DESC,
    example: DocsProperty.MFA_CODE_EXAMPLE
  })
  @Matches(MfaCodeRegex, { message: ValidationError.WRONG_MFA_CODE_FORMAT })
  readonly code: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.TWO_FA_TOKEN_DESC,
    example: DocsProperty.TWO_FA_TOKEN_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_TWO_FA_TOKEN_FORMAT })
  @Length(32, 32, { message: ValidationError.WRONG_TWO_FA_TOKEN_LENGTH })
  readonly twoFaToken: string;

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
