export class LoggedOutDto {
  constructor(message = 'user-logged-out') {
    this.message = message;
  }

  readonly message: string;
}
