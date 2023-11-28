export type UsersList = Array<{
  id: string;
  email: string;
  roles: Array<{
    id: string;
    value: string;
  }>;
  registrationHash: {
    confirmed: boolean;
    createdAt: Date;
  };
}>;
