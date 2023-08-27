import { IsEnum, IsOptional, Matches } from 'class-validator';
import { Language } from '@interfaces/language.enum';
import { EmailRegex } from '@regex/email.regex';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ForgotPasswordDto {
  @Matches(EmailRegex, { message: ValidationError.WRONG_EMAIL_FORMAT })
  readonly email: string;

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
