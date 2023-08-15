export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  mfaCode?: string;
  phoneCode?: string;
}
