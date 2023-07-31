import { Matches } from 'class-validator';
import { ImageRegex } from '@regex/image.regex';

export class UploadPhotoDto {
  @Matches(ImageRegex, { message: 'user-photo-must-be-base64' })
  readonly userPhoto: string;
}
