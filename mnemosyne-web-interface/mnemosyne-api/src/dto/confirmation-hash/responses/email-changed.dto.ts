export class EmailChangedDto {
  readonly message: string;

  constructor(message = 'email-changed') {
    this.message = message;
  }
}
