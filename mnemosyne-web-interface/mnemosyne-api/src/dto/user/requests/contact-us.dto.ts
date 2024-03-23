import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { ValidationError } from '@interfaces/validation-error.enum';
import { Language } from '@interfaces/language.enum';

export class ContactUsDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  @Matches(EmailRegex, { message: ValidationError.WRONG_EMAIL_FORMAT })
  readonly contactEmail: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.CONTACT_MESSAGE_DESC,
    example: DocsProperty.CONTACT_MESSAGE_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_CONTACT_MESSAGE_FORMAT })
  @Length(2, 1024, { message: ValidationError.WRONG_CONTACT_MESSAGE_LENGTH })
  readonly contactMessage: string;

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
