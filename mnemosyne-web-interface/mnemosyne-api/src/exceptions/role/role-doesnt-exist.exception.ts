import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class RoleDoesntExistException extends NotFoundException {
  @ApiProperty({
    type: String,
    description: DocsProperty.ROLES_DOESNT_EXIST_DESC,
    example: DocsProperty.ROLES_DOESNT_EXIST_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'role-doesnt-exists') {
    super(message);
    this.message = message;
  }
}
