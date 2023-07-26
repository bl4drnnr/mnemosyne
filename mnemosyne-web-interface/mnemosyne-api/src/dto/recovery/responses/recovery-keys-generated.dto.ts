export class RecoveryKeysGeneratedDto {
  readonly message: string;

  constructor(message = 'recovery-keys-generated') {
    this.message = message;
  }
}
