import { UploadPhotoDto } from '@dto/upload-photo.dto';

export interface UploadPhotoInterface {
  payload: UploadPhotoDto;
  userId: string;
}
