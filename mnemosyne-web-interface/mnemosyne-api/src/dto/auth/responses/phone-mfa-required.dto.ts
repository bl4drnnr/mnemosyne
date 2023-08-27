import { ApiProperty } from '@nestjs/swagger';

export class PhoneMfaRequiredDto {
  @ApiProperty({
    type: String,
    description: 'Phone MFA required response message',
    example: 'phone-required'
  })
  readonly message: string;

  constructor(message = 'phone-required') {
    this.message = message;
  }
}
