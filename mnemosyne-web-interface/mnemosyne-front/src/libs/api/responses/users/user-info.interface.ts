export interface UserInfoResponse {
  userId: string;
  firstName: string;
  lastName: string;
  namePronunciation: string | null;
  homeAddress: string | null;
  homePhone: string | null;
  email: string;
  companyId: string | null;
  isProfilePicPresent: boolean;
}
