import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { RoleScope } from '@custom-types/role-scope.type';

interface UserInfoResponse {
  userIdHash: string;
  firstName: string;
  lastName: string;
  namePronunciation: string | null;
  homeAddress: string | null;
  homePhone: string | null;
  email: string;
  isProfilePicPresent: boolean;
  isCompanyMember: boolean;
  companyName: string | null;
  companyId: string | null;
  roleName: string | null;
  roleScopes: Array<RoleScope> | null;
}

export class GetUserInfoResponseDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.USER_HASH_DESC,
    example: DocsProperty.USER_HASH_EXAMPLE
  })
  readonly userIdHash: string;

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

  @ApiProperty({
    type: Boolean,
    description: DocsProperty.IS_COMPANY_MEMBER_DESC,
    example: DocsProperty.IS_COMPANY_MEMBER_EXAMPLE
  })
  readonly isCompanyMember: boolean;

  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_NAME_DESC,
    example: DocsProperty.COMPANY_NAME_EXAMPLE
  })
  readonly companyName: string | null;

  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_ID_DESC,
    example: DocsProperty.COMPANY_ID_EXAMPLE
  })
  readonly companyId: string | null;

  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_ROLE_NAME_DESC,
    example: DocsProperty.COMPANY_ROLE_NAME_EXAMPLE
  })
  readonly roleName: string | null;

  @ApiProperty({
    type: Array<RoleScope>,
    description: DocsProperty.COMPANY_ROLE_SCOPES_DESC,
    example: [DocsProperty.COMPANY_ROLE_SCOPE_EXAMPLE],
    isArray: true
  })
  readonly roleScopes: Array<RoleScope> | null;

  constructor({
    userIdHash,
    firstName,
    lastName,
    namePronunciation,
    homeAddress,
    homePhone,
    email,
    isProfilePicPresent,
    isCompanyMember,
    companyName,
    companyId,
    roleName,
    roleScopes
  }: UserInfoResponse) {
    this.userIdHash = userIdHash;
    this.firstName = firstName;
    this.lastName = lastName;
    this.namePronunciation = namePronunciation;
    this.homeAddress = homeAddress;
    this.homePhone = homePhone;
    this.email = email;
    this.isProfilePicPresent = isProfilePicPresent;
    this.isCompanyMember = isCompanyMember;
    this.companyName = companyName;
    this.companyId = companyId;
    this.roleName = roleName;
    this.roleScopes = roleScopes;
  }
}
