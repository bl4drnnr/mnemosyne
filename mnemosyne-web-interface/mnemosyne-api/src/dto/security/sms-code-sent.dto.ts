export class SmsCodeSentDto {
  readonly message: string;

  constructor(message = 'sms-code-sent') {
    this.message = message;
  }
}
