import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PhoneRegex } from '@regex/phone.regex';
import { Language } from '@interfaces/language.enum';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class RegistrationSendSmsCodeDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PHONE_DESC,
    example: DocsProperty.PHONE_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_PHONE_FORMAT })
  @Matches(PhoneRegex, { message: ValidationError.WRONG_PHONE_FORMAT })
  readonly phone: string;

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
