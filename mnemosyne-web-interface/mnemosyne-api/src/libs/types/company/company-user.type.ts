export type CompanyUserType = {
  id: string;
  email: string;
  roles?: Array<{
    id: string;
    name: string;
  }>;
  registrationHash: {
    confirmed: boolean;
    createdAt: Date;
  };
};
