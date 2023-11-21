type UsersList = Array<{
  id: string;
  email: string;
  registrationHash: {
    confirmed: boolean;
    createdAt: Date;
  };
}>;

export interface GetCompanyInfoByIdInterface {
  companyName: string;
  companyLocation: string;
  companyWebsite: string;
  companyOwnerId: string;
  companyOwnerEmail: string;
  companyUsers: UsersList;
  count: number;
}
