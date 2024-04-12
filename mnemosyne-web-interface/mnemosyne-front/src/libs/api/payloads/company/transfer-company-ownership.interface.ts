export interface TransferCompanyOwnershipPayload {
  newCompanyOwnerEmail: string;
  newRoleForOldOwnerId: string;
  phoneCode?: string;
  mfaCode?: string;
  language?: string;
}
