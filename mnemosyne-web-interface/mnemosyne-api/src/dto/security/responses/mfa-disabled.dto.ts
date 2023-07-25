export class MfaDisabledDto {
  readonly message: string;

  constructor(message = 'mfa-disabled') {
    this.message = message;
  }
}
