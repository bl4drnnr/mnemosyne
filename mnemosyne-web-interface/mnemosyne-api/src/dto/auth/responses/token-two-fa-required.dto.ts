export class TokenTwoFaRequiredDto {
  readonly message: string;

  constructor(message = 'token-two-fa-required') {
    this.message = message;
  }
}
