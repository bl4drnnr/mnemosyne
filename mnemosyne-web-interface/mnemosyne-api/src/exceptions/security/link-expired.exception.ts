import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class LinkExpiredException extends NotFoundException {
  @ApiProperty({
    type: String,
    description: DocsProperty.LINK_EXPIRED_DESC,
    example: DocsProperty.LINK_EXPIRED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'link-expired') {
    super(message);
    this.message = message;
  }
}
