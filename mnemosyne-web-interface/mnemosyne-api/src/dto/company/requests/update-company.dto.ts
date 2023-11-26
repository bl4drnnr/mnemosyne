import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { IsFQDN, IsString, Length } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';

export class UpdateCompanyDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_LOCATION_DESC,
    example: DocsProperty.COMPANY_LOCATION_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_LOCATION_FORMAT })
  @Length(8, 128, { message: ValidationError.WRONG_LOCATION_LENGTH })
  readonly companyLocation: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_NAME_DESC,
    example: DocsProperty.COMPANY_NAME_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_COMPANY_FORMAT })
  @Length(2, 64, { message: ValidationError.WRONG_COMPANY_LENGTH })
  readonly companyName: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_WEBSITE_DESC,
    example: DocsProperty.COMPANY_WEBSITE_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_FQDN })
  @IsFQDN()
  readonly companyWebsite: string;
}
