import { IsOptional, IsString, Matches } from 'class-validator';
import { PasswordRegex } from '@regex/password.regex';
import { MfaCodeRegex } from '@regex/mfa-code.regex';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class DeleteAccountDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PASSWORD_DESC,
    example: DocsProperty.PASSWORD_EXAMPLE
  })
  @Matches(PasswordRegex, {
    message: ValidationError.WRONG_PASSWORD_FORMAT
  })
  readonly password: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.AUTH_MFA_CODE_DESC,
    example: DocsProperty.MFA_CODE_EXAMPLE
  })
  @ApiPropertyOptional()
  @IsOptional()
  @Matches(MfaCodeRegex, { message: ValidationError.WRONG_MFA_CODE_FORMAT })
  readonly mfaCode?: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.AUTH_MFA_CODE_DESC,
    example: DocsProperty.MFA_CODE_EXAMPLE
  })
  @ApiPropertyOptional()
  @IsOptional()
  @Matches(MfaCodeRegex, {
    message: ValidationError.WRONG_PHONE_CODE_FORMAT
  })
  readonly phoneCode?: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.FULL_NAME_DESC,
    example: DocsProperty.FILL_NAME_EXAMPLE
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly fullName?: string;
}
