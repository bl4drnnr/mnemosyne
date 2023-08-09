export class CompanyCreatedDto {
  readonly message: string;

  constructor(message = 'company-created') {
    this.message = message;
  }
}
