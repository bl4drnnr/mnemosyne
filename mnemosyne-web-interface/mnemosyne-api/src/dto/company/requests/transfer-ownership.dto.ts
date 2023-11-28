import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { IsEnum, IsOptional, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { ValidationError } from '@interfaces/validation-error.enum';
import { MfaCodeRegex } from '@regex/mfa-code.regex';
import { Language } from '@interfaces/language.enum';

export class TransferOwnershipDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  @Matches(EmailRegex, { message: ValidationError.WRONG_EMAIL_FORMAT })
  readonly newCompanyOwnerEmail: string;

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
    type: Language,
    enum: Language,
    description: DocsProperty.LANGUAGE_DESC
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Language)
  readonly language?: Language;
}
