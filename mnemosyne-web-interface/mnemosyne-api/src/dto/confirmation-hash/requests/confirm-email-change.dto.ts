import { IsEnum, IsOptional, Matches } from 'class-validator';
import { PasswordRegex } from '@regex/password.regex';
import { MfaCodeRegex } from '@regex/mfa-code.regex';
import { Language } from '@interfaces/language.enum';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ConfirmEmailChangeDto {
  @IsOptional()
  @Matches(PasswordRegex, {
    message: ValidationError.WRONG_PASSWORD_FORMAT
  })
  readonly password: string;

  @IsOptional()
  @Matches(MfaCodeRegex, { message: ValidationError.WRONG_MFA_CODE_FORMAT })
  readonly mfaCode: string;

  @IsOptional()
  @Matches(MfaCodeRegex, {
    message: ValidationError.WRONG_PHONE_CODE_FORMAT
  })
  readonly phoneCode: string;

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
