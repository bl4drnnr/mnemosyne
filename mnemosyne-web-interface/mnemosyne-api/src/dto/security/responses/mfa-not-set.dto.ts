import { ApiProperty } from '@nestjs/swagger';

export class MfaNotSetDto {
  @ApiProperty({
    type: String,
    description: 'MFA not set response message',
    example: 'mfa-not-set'
  })
  readonly message: string;

  constructor(message = 'mfa-not-set') {
    this.message = message;
  }
}
