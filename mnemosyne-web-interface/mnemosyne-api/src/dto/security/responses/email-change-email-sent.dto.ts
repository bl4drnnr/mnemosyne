export class EmailChangeEmailSentDto {
  readonly message: string;

  constructor(message = 'email-change-email-sent') {
    this.message = message;
  }
}
