import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class SubcategoryNotFoundException extends NotFoundException {
  @ApiProperty({
    type: String,
    description: DocsProperty.SUBCATEGORY_NOT_FOUND_DESC,
    example: DocsProperty.SUBCATEGORY_NOT_FOUND_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'subcategory-not-found') {
    super(message);
    this.message = message;
  }
}
