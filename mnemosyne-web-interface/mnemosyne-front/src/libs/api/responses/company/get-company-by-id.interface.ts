import { UsersList } from '@interfaces/users-list.type';

export interface GetCompanyInfoByIdInterface {
  companyName: string;
  companyLocation: string;
  companyWebsite: string;
  companyOwnerId: string;
  companyOwnerEmail: string;
  companyUsers: UsersList;
  count: number;
}
