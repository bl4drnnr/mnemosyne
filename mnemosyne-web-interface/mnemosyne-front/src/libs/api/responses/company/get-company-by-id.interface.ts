export interface GetCompanyInfoByIdInterface {
  companyName: string;
  companyLocation: string;
  companyWebsite: string;
  companyOwnerEmail: string;
  companyUsers: Array<{ id: string; email: string }>;
}
