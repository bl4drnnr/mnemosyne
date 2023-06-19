export interface ResetUserPasswordDto {
  password: string;
  hash: string;
  phoneCode: string;
  mfaCode: string;
}
