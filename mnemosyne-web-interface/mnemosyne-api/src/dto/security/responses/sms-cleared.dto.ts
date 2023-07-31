export class SmsClearedDto {
  readonly message: string;

  constructor(message = 'sms-cleared') {
    this.message = message;
  }
}
