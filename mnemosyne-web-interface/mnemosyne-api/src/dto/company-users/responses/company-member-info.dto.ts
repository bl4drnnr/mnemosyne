import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyMemberInfoDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.USER_ID_DESC,
    example: DocsProperty.USER_ID_EXAMPLE
  })
  readonly memberId: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  readonly email: string;

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
    description: DocsProperty.NAME_PRONUNS_DESC,
    example: DocsProperty.NAME_PRONUNS_EXAMPLE
  })
  readonly namePronunciation: string | null;

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

  constructor({
    memberId,
    email,
    firstName,
    lastName,
    namePronunciation,
    homeAddress,
    homePhone
  }: {
    memberId: string;
    email: string;
    firstName: string;
    lastName: string;
    namePronunciation: string | null;
    homeAddress: string | null;
    homePhone: string | null;
  }) {
    this.memberId = memberId;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.namePronunciation = namePronunciation;
    this.homeAddress = homeAddress;
    this.homePhone = homePhone;
  }
}
