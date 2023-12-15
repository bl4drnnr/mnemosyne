import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class RoleAlreadyExistsException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.ROLE_ALREADY_EXISTS_DESC,
    example: DocsProperty.ROLE_ALREADY_EXISTS_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'role-already-exists') {
    super(message);
    this.message = message;
  }
}
