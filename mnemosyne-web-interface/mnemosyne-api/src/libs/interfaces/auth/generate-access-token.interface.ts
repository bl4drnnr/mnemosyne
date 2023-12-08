export interface GenerateAccessTokenInterface {
  userId: string;
  companyId: string | null;
  roles?: Array<{ id: string; name: string; description: string }>;
}
