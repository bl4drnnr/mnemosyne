export interface UserInfoResponse {
  userId: string;
  firstName: string;
  lastName: string;
  namePronunciation: string;
  homeAddress: string;
  homePhone: string;
  email: string;
  companyId: string | null;
  isProfilePicPresent: boolean;
}
