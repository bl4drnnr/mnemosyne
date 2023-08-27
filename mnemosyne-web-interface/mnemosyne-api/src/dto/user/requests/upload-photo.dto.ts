import { Matches } from 'class-validator';
import { ImageRegex } from '@regex/image.regex';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class UploadPhotoDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.USER_PHOTO_DESC,
    example: DocsProperty.USER_PHOTO_EXAMPLE
  })
  @Matches(ImageRegex, { message: ValidationError.WRONG_IMAGE_FORMAT })
  readonly userPhoto: string;
}
