import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class GetUserInfoResponseDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.USER_ID_DESC,
    example: DocsProperty.USER_ID_EXAMPLE
  })
  readonly userId: string;

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
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  readonly email: string;

  @ApiProperty({
    type: Boolean,
    description: DocsProperty.IS_USER_PROFILE_PIC_DESC,
    example: DocsProperty.IS_USER_PROFILE_PIC_EXAMPLE
  })
  readonly isProfilePicPresent: boolean;

  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_ID_DESC,
    example: DocsProperty.COMPANY_ID_EXAMPLE
  })
  readonly companyId: string | null;

  constructor({
    userId,
    firstName,
    lastName,
    email,
    isProfilePicPresent,
    companyId
  }: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    isProfilePicPresent: boolean;
    companyId: string | null;
  }) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.isProfilePicPresent = isProfilePicPresent;
    this.companyId = companyId;
  }
}
