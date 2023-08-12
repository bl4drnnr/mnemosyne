export class FullMfaRequiredDto {
  readonly message: string;

  constructor(message = 'full-mfa-required') {
    this.message = message;
  }
}
