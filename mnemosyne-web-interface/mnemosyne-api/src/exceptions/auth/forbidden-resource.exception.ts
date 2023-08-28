import { ForbiddenException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ForbiddenResourceException extends ForbiddenException {
  @ApiProperty({
    type: String,
    description: DocsProperty.FORBIDDEN_RESOURCE_DESC,
    example: DocsProperty.FORBIDDEN_RESOURCE_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'forbidden') {
    super(message);
    this.message = message;
  }
}
