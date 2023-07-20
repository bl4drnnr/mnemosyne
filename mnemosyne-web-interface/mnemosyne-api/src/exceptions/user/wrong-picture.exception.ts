import { BadRequestException } from '@nestjs/common';

export class WrongPictureException extends BadRequestException {
  constructor(message = 'wrong-picture-format') {
    super(message);
  }
}
