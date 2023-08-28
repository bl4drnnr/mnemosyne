import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class HashNotFoundException extends NotFoundException {
  @ApiProperty({
    type: String,
    description: DocsProperty.HASH_NOT_FOUND_DESC,
    example: DocsProperty.HASH_NOT_FOUND_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'hash-not-found') {
    super(message);
    this.message = message;
  }
}
