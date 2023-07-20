import { BadRequestException } from '@nestjs/common';

export class WrongPictureException extends BadRequestException {
  constructor(
    message = 'wrong-picture-format',
    description = 'Wrong format of the uploaded picture'
  ) {
    super(message, description);
  }
}
