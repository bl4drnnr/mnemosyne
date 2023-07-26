export class AccountRecoveredDto {
  readonly message: string;

  constructor(message = 'account-recovered') {
    this.message = message;
  }
}
