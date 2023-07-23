import { Matches } from 'class-validator';

export class UploadPhotoDto {
  @Matches(/data:image\/png;base64,([^\"]*)/, { message: 'user-photo-must-be-base64' })
  readonly userPhoto: string;
}
