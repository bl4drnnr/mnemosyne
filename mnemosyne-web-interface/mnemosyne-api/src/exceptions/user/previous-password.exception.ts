import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class PreviousPasswordException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.PREVIOUS_PASSWORD_DESC,
    example: DocsProperty.PREVIOUS_PASSWORD_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'previous-password') {
    super(message);
    this.message = message;
  }
}
