import { UsersList } from '@interfaces/users-list.type';

export interface GetCompanyUsersResponse {
  companyUsers: UsersList;
  count: number;
}
