export class UserUpdatedDto {
  readonly message: string;

  constructor(message = 'user-updated') {
    this.message = message;
  }
}
