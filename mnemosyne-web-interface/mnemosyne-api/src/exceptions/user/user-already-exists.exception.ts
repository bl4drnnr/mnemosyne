import { ConflictException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class UserAlreadyExistsException extends ConflictException {
  @ApiProperty({
    type: String,
    description: DocsProperty.USER_ALREADY_EXISTS_DESC,
    example: DocsProperty.USER_ALREADY_EXISTS_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'user-already-exists') {
    super(message);
    this.message = message;
  }
}
