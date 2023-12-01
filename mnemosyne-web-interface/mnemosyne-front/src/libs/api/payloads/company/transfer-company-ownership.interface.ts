export interface TransferCompanyOwnershipPayload {
  newCompanyOwnerEmail: string;
  phoneCode?: string;
  mfaCode?: string;
  language?: string;
}
