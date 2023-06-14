export class UserCreatedDto {
  readonly message: string;

  constructor(message = 'user-created') {
    this.message = message;
  }
}
