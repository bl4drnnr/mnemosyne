import { ForbiddenException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class TacNotAcceptedException extends ForbiddenException {
  @ApiProperty({
    type: String,
    description: DocsProperty.TAC_NOT_ACCEPTED_DESC,
    example: DocsProperty.TAC_NOT_ACCEPTED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'tac-not-accepted') {
    super(message);
    this.message = message;
  }
}
