import { IsOptional, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationError } from '@interfaces/validation-error.enum';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { MfaCodeRegex } from '@regex/mfa-code.regex';

export class LogInUserDto {
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

  @ApiProperty({
    type: String,
    description: DocsProperty.PHONE_MFA_CODE_DESC,
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
    description: DocsProperty.AUTH_MFA_CODE_DESC,
    example: DocsProperty.MFA_CODE_EXAMPLE
  })
  @ApiPropertyOptional()
  @IsOptional()
  @Matches(MfaCodeRegex, {
    message: ValidationError.WRONG_PHONE_CODE_FORMAT
  })
  readonly mfaCode?: string;
}

export class LogInUserResponseDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.ACCESS_TOKEN_DESC,
    example: DocsProperty.ACCESS_TOKEN_EXAMPLE
  })
  readonly _at: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.REFRESH_TOKEN_DESC,
    example: DocsProperty.REFRESH_TOKEN_EXAMPLE
  })
  readonly _rt: string;

  constructor({ _at, _rt }: { _at: string; _rt: string; }) {
    this._at = _at;
    this._rt = _rt;
  }
}
