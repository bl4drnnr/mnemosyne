export interface UserSecurityResponse {
  emailChanged: boolean;
  passwordCanBeChanged: boolean;
  phoneStatus: {
    isSetUp: boolean;
    twoLastDigit: string | null;
  };
  isTwoFaSetUp: boolean;
  email: string;
}
