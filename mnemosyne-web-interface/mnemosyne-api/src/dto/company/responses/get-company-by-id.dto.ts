import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class GetCompanyByIdDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_NAME_DESC,
    example: DocsProperty.COMPANY_NAME_EXAMPLE
  })
  readonly companyName: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_LOCATION_DESC,
    example: DocsProperty.COMPANY_LOCATION_EXAMPLE
  })
  readonly companyLocation: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_WEBSITE_DESC,
    example: DocsProperty.COMPANY_WEBSITE_EXAMPLE
  })
  readonly companyWebsite: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.USER_ID_DESC,
    example: DocsProperty.USER_ID_EXAMPLE
  })
  readonly companyOwnerId: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  readonly companyOwnerEmail: string;

  constructor({
    companyName,
    companyLocation,
    companyWebsite,
    companyOwnerId,
    companyOwnerEmail
  }: {
    companyName: string;
    companyLocation: string;
    companyWebsite: string;
    companyOwnerId: string;
    companyOwnerEmail: string;
  }) {
    this.companyName = companyName;
    this.companyLocation = companyLocation;
    this.companyWebsite = companyWebsite;
    this.companyOwnerId = companyOwnerId;
    this.companyOwnerEmail = companyOwnerEmail;
  }
}
