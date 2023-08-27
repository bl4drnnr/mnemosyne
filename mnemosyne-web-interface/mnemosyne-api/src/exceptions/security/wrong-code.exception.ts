import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class WrongCodeException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: 'Wrong code error message',
    example: 'wrong-code'
  })
  readonly message: string;

  constructor(message = 'wrong-code') {
    super(message);
    this.message = message;
  }
}
