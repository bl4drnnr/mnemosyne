import { DocsProperty } from '@interfaces/docs-property.enum';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyUserType } from '@custom-types/company-user.type';

type UsersList = Array<CompanyUserType>;

export class GetCompanyUsersDto {
  @ApiProperty({
    type: Array<CompanyUserType>,
    description: DocsProperty.COMPANY_USERS_DESC,
    example: [
      {
        id: DocsProperty.USER_ID_EXAMPLE,
        email: DocsProperty.EMAIL_EXAMPLE,
        role: {
          id: DocsProperty.ROLE_ID_EXAMPLE,
          name: DocsProperty.ROLE_ID_NAME
        },
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
    companyUsers,
    count
  }: {
    companyUsers: UsersList;
    count: number;
  }) {
    this.companyUsers = companyUsers;
    this.count = count;
  }
}
