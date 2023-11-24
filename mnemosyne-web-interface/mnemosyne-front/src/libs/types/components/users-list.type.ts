export type UsersList = Array<{
  id: string;
  email: string;
  registrationHash: {
    confirmed: boolean;
    createdAt: Date;
  };
}>;
