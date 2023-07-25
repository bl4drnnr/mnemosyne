import { BadRequestException } from '@nestjs/common';

export class UnhandledEndpointException extends BadRequestException {
  constructor(message = 'unhandled-endpoint') {
    super(message);
  }
}
