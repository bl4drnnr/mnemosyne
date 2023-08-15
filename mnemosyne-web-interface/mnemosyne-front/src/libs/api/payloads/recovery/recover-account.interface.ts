export interface RecoverAccountPayload {
  passphrase: string;
  recoveryKeys: Array<string>;
}
