import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class EmailChangedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_CHANGED_DESC,
    example: DocsProperty.EMAIL_CHANGED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'email-changed') {
    this.message = message;
  }
}
