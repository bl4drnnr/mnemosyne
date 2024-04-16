import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

class MarketplaceUser {
  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  readonly email: string | undefined;

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

  @ApiProperty({
    type: String,
    description: DocsProperty.HOME_ADDRESS_DESC,
    example: DocsProperty.HOME_ADDRESS_EXAMPLE
  })
  readonly homeAddress: string | null;

  @ApiProperty({
    type: String,
    description: DocsProperty.HOME_PHONE_DESC,
    example: DocsProperty.HOME_PHONE_EXAMPLE
  })
  readonly homePhone: string | null;

  @ApiProperty({
    type: String,
    description: DocsProperty.NAME_PRONUNS_DESC,
    example: DocsProperty.NAME_PRONUNS_EXAMPLE
  })
  readonly namePronunciation: string | null;

  @ApiProperty({
    type: Date,
    description: DocsProperty.USER_CREATED_AT_DESC,
    example: DocsProperty.USER_CREATED_AT_EXAMPLE
  })
  readonly createdAt: Date;

  @ApiProperty({
    type: String,
    description: DocsProperty.USER_HASH_DESC,
    example: DocsProperty.USER_HASH_EXAMPLE
  })
  readonly userIdHash: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_ID_DESC,
    example: DocsProperty.COMPANY_ID_EXAMPLE
  })
  readonly companyId: string | null;

  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_NAME_DESC,
    example: DocsProperty.COMPANY_NAME_EXAMPLE
  })
  readonly companyName: string | null;
}

export class GetMarketplaceUserByIdDto {
  @ApiProperty({
    type: MarketplaceUser,
    description: DocsProperty.MARKETPLACE_USER_DESC,
    example: {
      email: DocsProperty.EMAIL_EXAMPLE,
      firstName: DocsProperty.FIRST_NAME_EXAMPLE,
      lastName: DocsProperty.LAST_NAME_EXAMPLE,
      homeAddress: DocsProperty.HOME_ADDRESS_EXAMPLE,
      homePhone: DocsProperty.HOME_PHONE_EXAMPLE,
      namePronunciation: DocsProperty.NAME_PRONUNS_EXAMPLE,
      createdAt: DocsProperty.USER_CREATED_AT_EXAMPLE,
      userIdHash: DocsProperty.USER_HASH_EXAMPLE,
      companyId: DocsProperty.COMPANY_ID_EXAMPLE,
      companyName: DocsProperty.COMPANY_NAME_EXAMPLE
    }
  })
  readonly marketplaceUser: MarketplaceUser;

  constructor(marketplaceUser: MarketplaceUser) {
    this.marketplaceUser = marketplaceUser;
  }
}
