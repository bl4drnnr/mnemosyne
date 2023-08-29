import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class WrongDeletionConfirmationException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.WRONG_DELETION_CONFIRMATION_DESC,
    example: DocsProperty.WRONG_DELETION_CONFIRMATION_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'wrong-deletion-confirmation') {
    super(message);
    this.message = message;
  }
}
