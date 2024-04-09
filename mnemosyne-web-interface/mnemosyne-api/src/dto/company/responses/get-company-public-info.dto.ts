import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

interface GetCompanyPublicInfo {
  count: number;
  quantityOfUsers: number;
  companyOwnerId: string;
  companyOwnerFirstName: string;
  companyOwnerLastName: string;
  companyName: string;
  companyLocation: string;
  companyWebsite: string;
  companyMembers: Array<CompanyMember>;
}

class CompanyMember {
  @ApiProperty({
    type: String,
    description: DocsProperty.USER_ID_DESC,
    example: DocsProperty.USER_ID_EXAMPLE
  })
  readonly id: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.FIRST_NAME_DESC,
    example: DocsProperty.FIRST_NAME_EXAMPLE
  })
  readonly firstName: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.LAST_NAME_DESC,
    example: DocsProperty.LAST_NAME_EXAMPLE
  })
  readonly lastName: string;
}

export class GetCompanyPublicInfoDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.USER_ID_DESC,
    example: DocsProperty.USER_ID_EXAMPLE
  })
  readonly companyOwnerId: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.FIRST_NAME_DESC,
    example: DocsProperty.FIRST_NAME_EXAMPLE
  })
  readonly companyOwnerFirstName: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.LAST_NAME_DESC,
    example: DocsProperty.LAST_NAME_EXAMPLE
  })
  readonly companyOwnerLastName: string;

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
    type: Array<CompanyMember>,
    description: DocsProperty.COMPANY_MEMBERS_IDS_LIST_DESC,
    example: [DocsProperty.COMPANY_MEMBERS_IDS_LIST_EXAMPLE]
  })
  readonly companyMembers: Array<CompanyMember>;

  @ApiProperty({
    type: Number,
    description: DocsProperty.COUNT_DESC,
    example: DocsProperty.COUNT_EXAMPLE
  })
  readonly count: number;

  @ApiProperty({
    type: Number,
    description: DocsProperty.QUANTITY_OF_COMPANY_MEMBERS_DESC,
    example: DocsProperty.QUANTITY_OF_COMPANY_MEMBERS_EXAMPLE
  })
  readonly quantityOfUsers: number;

  constructor({
    count,
    quantityOfUsers,
    companyOwnerId,
    companyOwnerFirstName,
    companyOwnerLastName,
    companyName,
    companyLocation,
    companyWebsite,
    companyMembers
  }: GetCompanyPublicInfo) {
    this.count = count;
    this.quantityOfUsers = quantityOfUsers;
    this.companyOwnerId = companyOwnerId;
    this.companyOwnerFirstName = companyOwnerFirstName;
    this.companyOwnerLastName = companyOwnerLastName;
    this.companyName = companyName;
    this.companyLocation = companyLocation;
    this.companyWebsite = companyWebsite;
    this.companyMembers = companyMembers;
  }
}
