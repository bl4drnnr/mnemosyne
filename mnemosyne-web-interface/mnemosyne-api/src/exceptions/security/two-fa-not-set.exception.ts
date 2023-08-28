import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class TwoFaNotSetException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.TWO_FA_NOT_SET_UP_DESC,
    example: DocsProperty.TWO_FA_NOT_SET_UP_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'two-fa-not-set-up') {
    super(message);
    this.message = message;
  }
}
