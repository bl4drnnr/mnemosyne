import { Matches } from 'class-validator';
import { ImageRegex } from '@regex/image.regex';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class UploadPhotoDto {
  @Matches(ImageRegex, { message: ValidationErrorEnum.WRONG_IMAGE_FORMAT })
  readonly userPhoto: string;
}
