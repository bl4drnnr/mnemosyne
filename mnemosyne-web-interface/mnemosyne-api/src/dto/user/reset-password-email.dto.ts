export class ResetPasswordEmailDto {
  readonly message: string;

  constructor(message = 'reset-password-email-sent') {
    this.message = message;
  }
}
