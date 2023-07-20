export class DeleteConfirmationRequiredDto {
  readonly message: string;

  constructor(message = 'delete-confirmation-required') {
    this.message = message;
  }
}
