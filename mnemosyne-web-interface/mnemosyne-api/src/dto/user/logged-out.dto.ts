export class LoggedOutDto {
  readonly message: string;

  constructor(message = 'user-logged-out') {
    this.message = message;
  }
}
