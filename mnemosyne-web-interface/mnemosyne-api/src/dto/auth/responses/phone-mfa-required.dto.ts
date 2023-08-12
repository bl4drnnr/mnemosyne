export class PhoneMfaRequiredDto {
  readonly message: string;

  constructor(message = 'phone-required') {
    this.message = message;
  }
}
