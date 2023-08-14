export interface ChangePasswordInterface {
  currentPassword: string;
  newPassword: string;
  mfaCode?: string;
  phoneCode?: string;
}
