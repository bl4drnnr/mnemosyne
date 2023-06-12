export class AccountConfirmedDto {
  constructor(message = 'account-confirmed') {
    this.message = message;
  }

  readonly message: string;
}
