export class PasswordNotSetDto {
  readonly message: string;

  constructor(message = 'password-not-set') {
    this.message = message;
  }
}
