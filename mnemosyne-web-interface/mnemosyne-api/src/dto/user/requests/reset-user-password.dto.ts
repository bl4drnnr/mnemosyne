import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { PasswordRegex } from '@regex/password.regex';
import { MfaCodeRegex } from '@regex/mfa-code.regex';
import { Language } from '@interfaces/language.enum';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ResetUserPasswordDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  @ApiPropertyOptional()
  @IsOptional()
  @Matches(PasswordRegex, {
    message: ValidationError.WRONG_PASSWORD_FORMAT
  })
  readonly password?: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.HASH_DESC,
    example: DocsProperty.HASH_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_HASH_FORMAT })
  @Length(40, 40, { message: ValidationError.WRONG_HASH_LENGTH })
  readonly hash: string;

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
    type: Language,
    enum: Language,
    description: DocsProperty.LANGUAGE_DESC
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Language)
  readonly language?: Language;
}
