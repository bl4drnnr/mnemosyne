import { IsOptional, IsString, Length } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class UpdateUserInfoDto {
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
