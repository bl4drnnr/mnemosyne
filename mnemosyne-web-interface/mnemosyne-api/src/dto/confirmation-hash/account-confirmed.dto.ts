export class AccountConfirmedDto {
  readonly message: string;

  constructor(message = 'account-confirmed') {
    this.message = message;
  }
}
