export interface MarketplaceUser {
  email: string | undefined;
  firstName: string;
  lastName: string;
  homeAddress: string | null;
  homePhone: string | null;
  namePronunciation: string | null;
  createdAt: Date;
  userIdHash: string | null;
}

export interface GetMarketplaceUserByIdResponse {
  marketplaceUser: MarketplaceUser;
}
