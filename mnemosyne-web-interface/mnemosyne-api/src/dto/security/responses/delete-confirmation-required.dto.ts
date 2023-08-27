import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class DeleteConfirmationRequiredDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.DELETE_CONFIRMATION_REQUIRED_DESC,
    example: DocsProperty.DELETE_CONFIRMATION_REQUIRED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'delete-confirmation-required') {
    this.message = message;
  }
}
