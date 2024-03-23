import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { PasswordRegex } from '@regex/password.regex';
import { Language } from '@interfaces/language.enum';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ConfirmCompanyAccDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.FIRST_NAME_DESC,
    example: DocsProperty.FIRST_NAME_EXAMPLE
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: ValidationError.WRONG_FIRST_NAME_FORMAT })
  @Length(1, 64, { message: ValidationError.WRONG_FIRST_NAME_LENGTH })
  readonly firstName?: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.LAST_NAME_DESC,
    example: DocsProperty.LAST_NAME_EXAMPLE
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: ValidationError.WRONG_LAST_NAME_FORMAT })
  @Length(1, 64, { message: ValidationError.WRONG_LAST_NAME_LENGTH })
  readonly lastName?: string;

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
