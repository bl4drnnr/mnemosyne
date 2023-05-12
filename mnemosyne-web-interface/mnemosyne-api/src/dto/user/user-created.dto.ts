export class UserCreatedDto {
  constructor(message = 'user-created') {
    this.message = message;
  }

  readonly message: string;
}
