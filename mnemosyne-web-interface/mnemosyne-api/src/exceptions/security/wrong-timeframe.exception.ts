import { BadRequestException } from '@nestjs/common';

export class WrongTimeframeException extends BadRequestException {
  constructor(message = 'wrong-timeframe') {
    super(message);
  }
}
