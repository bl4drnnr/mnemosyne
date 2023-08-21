export class CompanyMemberAccConfirmedDto {
  readonly message: string;

  constructor(message = 'company-member-acc-confirmed') {
    this.message = message;
  }
}
