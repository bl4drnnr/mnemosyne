import { BadRequestException } from '@nestjs/common';

export class PreviousPasswordException extends BadRequestException {
  constructor(
    message = 'previous-password',
    description = 'Previous password cannot be set as new one'
  ) {
    super(message, description);
  }
}
