export class RecoveryKeysNotSetDto {
  readonly message: string;

  constructor(message = 'recovery-keys-not-set') {
    this.message = message;
  }
}
