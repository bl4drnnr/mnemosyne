export class MfaSetDto {
  readonly message: string;

  constructor(message = 'mfa-set') {
    this.message = message;
  }
}
