import { ApiProperty } from '@nestjs/swagger';

export class TokenTwoFaRequiredDto {
  @ApiProperty({
    type: String,
    description: 'Token MFA required response message',
    example: 'token-two-fa-required'
  })
  readonly message: string;

  constructor(message = 'token-two-fa-required') {
    this.message = message;
  }
}
