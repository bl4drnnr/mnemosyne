export type UsersList = Array<{
  id: string;
  email: string;
  roles: Array<{
    id: string;
    name: string;
  }>;
  registrationHash: {
    confirmed: boolean;
    createdAt: Date;
  };
}>;
