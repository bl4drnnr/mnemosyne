import { Matches } from 'class-validator';
import { ImageRegex } from '@regex/image.regex';
import { ValidationError } from '@interfaces/validation-error.enum';

export class UploadPhotoDto {
  @Matches(ImageRegex, { message: ValidationError.WRONG_IMAGE_FORMAT })
  readonly userPhoto: string;
}
