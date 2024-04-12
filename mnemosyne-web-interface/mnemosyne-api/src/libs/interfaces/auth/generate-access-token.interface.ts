export interface GenerateAccessTokenInterface {
  userId: string;
  companyId: string | null;
  role?: { id: string; name: string; description: string };
}
