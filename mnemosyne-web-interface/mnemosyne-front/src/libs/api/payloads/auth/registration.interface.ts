export interface RegistrationPayload {
  email: string;
  password: string;
  tac: boolean;
  firstName: string;
  lastName: string;
  language?: string;
  namePronunciation?: string;
  homeAddress?: string;
  homePhone?: string;
}
