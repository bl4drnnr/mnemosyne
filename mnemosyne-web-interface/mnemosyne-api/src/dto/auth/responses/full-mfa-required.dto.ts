import { ApiProperty } from '@nestjs/swagger';

export class FullMfaRequiredDto {
  @ApiProperty({
    type: String,
    description: 'Full MFA (token + phone) required response message',
    example: 'full-mfa-required'
  })
  readonly message: string;

  constructor(message = 'full-mfa-required') {
    this.message = message;
  }
}
