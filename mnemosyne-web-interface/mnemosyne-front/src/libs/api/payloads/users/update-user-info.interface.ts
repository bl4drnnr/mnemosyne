export interface UpdateUserInfoPayload {
  memberId?: string;
  firstName: string;
  lastName: string;
  namePronunciation: string | null;
  homeAddress: string | null;
  homePhone: string | null;
}
