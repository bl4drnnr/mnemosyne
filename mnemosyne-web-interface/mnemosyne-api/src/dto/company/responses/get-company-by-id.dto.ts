import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

type UsersList = Array<{
  id: string;
  email: string;
  registrationHash: {
    confirmed: boolean;
    createdAt: Date;
  };
}>;

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

  @ApiProperty({
    type: Array<{
      id: string;
      email: string;
      registrationHash: {
        confirmed: boolean;
        createdAt: Date;
      };
    }>,
    description: DocsProperty.COMPANY_USERS_DESC,
    example: [
      {
        id: DocsProperty.USER_ID_EXAMPLE,
        email: DocsProperty.EMAIL_EXAMPLE,
        registrationHash: {
          confirmed: DocsProperty.CONFIRMED_HASH_EXAMPLE,
          createdAt: DocsProperty.CONFIRMATION_HASH_CREATED_AT_EXAMPLE
        }
      }
    ],
    isArray: true
  })
  readonly companyUsers: UsersList;

  @ApiProperty({
    type: Number,
    description: DocsProperty.COUNT_DESC,
    example: DocsProperty.COUNT_EXAMPLE
  })
  readonly count: number;

  constructor({
    companyName,
    companyLocation,
    companyWebsite,
    companyOwnerId,
    companyOwnerEmail,
    companyUsers,
    count
  }: {
    companyName: string;
    companyLocation: string;
    companyWebsite: string;
    companyOwnerId: string;
    companyOwnerEmail: string;
    companyUsers: UsersList;
    count: number;
  }) {
    this.companyName = companyName;
    this.companyLocation = companyLocation;
    this.companyWebsite = companyWebsite;
    this.companyOwnerId = companyOwnerId;
    this.companyOwnerEmail = companyOwnerEmail;
    this.companyUsers = companyUsers;
    this.count = count;
  }
}