export type UsersList = Array<{
  id: string;
  email: string;
  role: {
    id: string;
    name: string;
    description: string;
  };
  registrationHash: {
    confirmed: boolean;
    createdAt: Date;
  };
}>;
