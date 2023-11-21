import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ParseException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.PARSE_EXCEPTION_DESC,
    example: DocsProperty.PARSE_EXCEPTION_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'parse-error') {
    super(message);
    this.message = message;
  }
}
