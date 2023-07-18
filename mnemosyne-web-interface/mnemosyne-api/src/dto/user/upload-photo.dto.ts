import { IsBase64 } from 'class-validator';

export class UploadPhotoDto {
  @IsBase64()
  readonly formData: string;
}
