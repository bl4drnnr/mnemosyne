import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class RoleStillAssignedException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.ROLE_STILL_ASSIGNED_DESC,
    example: DocsProperty.ROLE_STILL_ASSIGNED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'role-still-assigned') {
    super(message);
    this.message = message;
  }
}
