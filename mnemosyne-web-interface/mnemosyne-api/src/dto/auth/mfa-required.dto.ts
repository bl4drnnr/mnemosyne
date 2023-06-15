export class MfaRequiredDto {
  readonly message: string;

  constructor(message = 'mfa-required') {
    this.message = message;
  }
}
