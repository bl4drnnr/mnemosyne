export interface ConfirmCompanyAccountPayload {
  firstName: string;
  lastName: string;
  password: string;
  confirmationHash: string;
  language?: string;
  namePronunciation?: string;
  homeAddress?: string;
  homePhone?: string;
}
