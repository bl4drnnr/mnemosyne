import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class UserNotFoundException extends NotFoundException {
  @ApiProperty({
    type: String,
    description: DocsProperty.USER_NOT_FOUND_EXCEPTION_DESC,
    example: DocsProperty.USER_NOT_FOUND_EXCEPTION_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'user-not-found') {
    super(message);
    this.message = message;
  }
}
