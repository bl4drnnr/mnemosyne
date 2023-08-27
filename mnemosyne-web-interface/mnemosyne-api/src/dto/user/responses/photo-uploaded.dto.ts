import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class PhotoUploadedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PHOTO_UPLOADED_DESC,
    example: DocsProperty.PHOTO_UPLOADED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'photo-uploaded') {
    this.message = message;
  }
}
