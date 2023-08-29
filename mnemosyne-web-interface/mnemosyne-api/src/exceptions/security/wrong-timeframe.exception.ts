import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class WrongTimeframeException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.WRONG_TIMEFRAME_DESC,
    example: DocsProperty.WRONG_TIMEFRAME_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'wrong-timeframe') {
    super(message);
    this.message = message;
  }
}
