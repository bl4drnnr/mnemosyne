export interface GenerateAccessTokenInterface {
  userId: string;
  companyId: string | null;
  roles: Array<string>;
}
