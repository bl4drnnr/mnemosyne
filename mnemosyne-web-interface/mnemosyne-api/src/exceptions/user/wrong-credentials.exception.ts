import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class WrongCredentialsException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: 'Wrong credentials error message',
    example: 'wrong-credentials'
  })
  readonly message: string;

  constructor(message = 'wrong-credentials') {
    super(message);
    this.message = message;
  }
}
