import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches
} from 'class-validator';
import { Language } from '@interfaces/language.enum';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CreateUserDto {
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
    description: DocsProperty.FIRST_NAME_DESC,
    example: DocsProperty.FIRST_NAME_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_FIRST_NAME_FORMAT })
  @Length(1, 64, { message: ValidationError.WRONG_FIRST_NAME_LENGTH })
  readonly firstName: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.LAST_NAME_DESC,
    example: DocsProperty.LAST_NAME_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_LAST_NAME_FORMAT })
  @Length(1, 64, { message: ValidationError.WRONG_LAST_NAME_LENGTH })
  readonly lastName: string;

  @ApiProperty({
    type: Boolean,
    description: DocsProperty.TAC_DESC,
    example: DocsProperty.TAC_EXAMPLE
  })
  @IsBoolean()
  readonly tac: boolean;

  @ApiProperty({
    type: Language,
    enum: Language,
    description: DocsProperty.LANGUAGE_DESC
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Language)
  readonly language?: Language;

  @ApiProperty({
    type: String,
    description: DocsProperty.NAME_PRONUNS_DESC,
    example: DocsProperty.NAME_PRONUNS_EXAMPLE
  })
  @ApiPropertyOptional()
  @IsOptional()
  readonly namePronunciation?: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.HOME_ADDRESS_DESC,
    example: DocsProperty.HOME_ADDRESS_EXAMPLE
  })
  @ApiPropertyOptional()
  @IsOptional()
  readonly homeAddress?: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.HOME_PHONE_DESC,
    example: DocsProperty.HOME_PHONE_EXAMPLE
  })
  @ApiPropertyOptional()
  @IsOptional()
  readonly homePhone?: string;
}
