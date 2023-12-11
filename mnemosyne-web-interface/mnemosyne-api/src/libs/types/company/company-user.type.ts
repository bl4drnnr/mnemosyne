export type CompanyUserType = {
  id: string;
  email: string;
  roles?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  registrationHash: {
    confirmed: boolean;
    createdAt: Date;
  };
};
