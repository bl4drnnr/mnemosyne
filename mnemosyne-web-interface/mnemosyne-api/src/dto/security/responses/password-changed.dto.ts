export class PasswordChangedDto {
  readonly message: string;

  constructor(message = 'password-changed') {
    this.message = message;
  }
}
