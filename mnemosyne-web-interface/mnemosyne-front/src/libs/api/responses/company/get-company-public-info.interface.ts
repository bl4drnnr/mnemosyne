export interface CompanyMember {
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetCompanyPublicInfoInfoResponse {
  count: number;
  companyOwnerId: string;
  companyOwnerFirstName: string;
  companyOwnerLastName: string;
  companyName: string;
  companyLocation: string;
  companyWebsite: string;
  companyMembers: Array<CompanyMember>;
}
