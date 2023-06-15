export class MfaNotSetDto {
  readonly message: string;

  constructor(message = 'mfa-not-set') {
    this.message = message;
  }
}
