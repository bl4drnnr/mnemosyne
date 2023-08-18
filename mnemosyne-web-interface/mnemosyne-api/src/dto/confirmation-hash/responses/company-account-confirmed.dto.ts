export class CompanyAccountConfirmedDto {
  readonly message: string;

  constructor(message = 'company-account-confirmed') {
    this.message = message;
  }
}
