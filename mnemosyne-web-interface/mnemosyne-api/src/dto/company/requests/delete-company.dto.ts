import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength
} from 'class-validator';
import { MfaCodeRegex } from '@regex/mfa-code.regex';
import { ValidationError } from '@interfaces/validation-error.enum';
import { Language } from '@interfaces/language.enum';
import { PasswordRegex } from '@regex/password.regex';

export class DeleteCompanyDto {
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
    description: DocsProperty.PASSPHRASE_DESC,
    example: DocsProperty.PASSPHRASE_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_PASSPHRASE_FORMAT })
  @Length(8, 128, { message: ValidationError.WRONG_PASSPHRASE_LENGTH })
  readonly passphrase: string;

  @ApiProperty({
    type: Array<string>,
    description: DocsProperty.RECOVERY_KEYS_DESC,
    example: [
      DocsProperty.RECOVERY_KEY_EXAMPLE,
      DocsProperty.RECOVERY_KEY_EXAMPLE,
      DocsProperty.RECOVERY_KEY_EXAMPLE,
      DocsProperty.RECOVERY_KEY_EXAMPLE,
      DocsProperty.RECOVERY_KEY_EXAMPLE
    ],
    isArray: true,
    minLength: 5,
    maxLength: 5
  })
  @ArrayMinSize(5, { message: ValidationError.WRONG_REC_KEYS })
  @ArrayMaxSize(5, { message: ValidationError.WRONG_REC_KEYS })
  @MaxLength(1024, {
    each: true,
    message: ValidationError.WRONG_REC_KEYS
  })
  readonly recoveryKeys: Array<string>;

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
    description: DocsProperty.LANGUAGE_DESC,
    example: DocsProperty.LANGUAGE_EXAMPLE
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Language)
  readonly language?: Language;
}
