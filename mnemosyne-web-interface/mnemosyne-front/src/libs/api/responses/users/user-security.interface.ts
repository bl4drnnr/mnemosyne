export interface UserSecurityInterface {
  emailChanged: boolean;
  passwordCanBeChanged: boolean;
  phoneStatus: {
    isSetUp: boolean;
    twoLastDigit: string | null;
  };
  isTwoFaSetUp: boolean;
  email: string;
}
