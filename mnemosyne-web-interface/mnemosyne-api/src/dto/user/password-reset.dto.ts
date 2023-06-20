export class PasswordResetDto {
  readonly message: string;

  constructor(message = 'password-reset') {
    this.message = message;
  }
}
