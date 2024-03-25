import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CategoryNotFoundException extends NotFoundException {
  @ApiProperty({
    type: String,
    description: DocsProperty.CATEGORY_NOT_FOUND_DESC,
    example: DocsProperty.CATEGORY_NOT_FOUND_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'category-not-found') {
    super(message);
    this.message = message;
  }
}
