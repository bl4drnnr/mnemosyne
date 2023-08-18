export class UserDataNotSetDto {
  readonly message: string;

  constructor(message = 'user-data-not-set') {
    this.message = message;
  }
}
