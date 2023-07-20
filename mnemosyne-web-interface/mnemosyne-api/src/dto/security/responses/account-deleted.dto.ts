export class AccountDeletedDto {
  readonly message: string;

  constructor(message = 'account-deleted') {
    this.message = message;
  }
}
