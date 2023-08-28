import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class WrongPictureException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.WRONG_PICTURE_FORMAT_DESC,
    example: DocsProperty.WRONG_PICTURE_FORMAT_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'wrong-picture-format') {
    super(message);
    this.message = message;
  }
}
