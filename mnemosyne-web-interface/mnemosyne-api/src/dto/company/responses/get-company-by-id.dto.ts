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
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  readonly companyOwnerEmail: string;

  @ApiProperty({
    type: Array<{ id: string; email: string }>,
    description: DocsProperty.COMPANY_USERS_DESC,
    example: [
      { id: DocsProperty.USER_ID_EXAMPLE, email: DocsProperty.EMAIL_EXAMPLE }
    ],
    isArray: true
  })
  readonly companyUsers: Array<{ id: string; email: string }>;

  constructor({
    companyName,
    companyLocation,
    companyWebsite,
    companyOwnerEmail,
    companyUsers
  }: {
    companyName: string;
    companyLocation: string;
    companyWebsite: string;
    companyOwnerEmail: string;
    companyUsers: Array<{ id: string; email: string }>;
  }) {
    this.companyName = companyName;
    this.companyLocation = companyLocation;
    this.companyWebsite = companyWebsite;
    this.companyOwnerEmail = companyOwnerEmail;
    this.companyUsers = companyUsers;
  }
}
