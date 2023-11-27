import { DocsProperty } from '@interfaces/docs-property.enum';
import { ApiProperty } from '@nestjs/swagger';

type UsersList = Array<{
  id: string;
  email: string;
  registrationHash: {
    confirmed: boolean;
    createdAt: Date;
  };
}>;

export class GetCompanyUsersDto {
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
