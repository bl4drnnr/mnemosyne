export class PhotoUploadedDto {
  readonly message: string;

  constructor(message = 'photo-uploaded') {
    this.message = message;
  }
}
