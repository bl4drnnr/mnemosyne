import { ApiProperty } from '@nestjs/swagger';

export class RecoveryKeysNotSetDto {
  @ApiProperty({
    type: String,
    description: 'Recovery keys not set response message',
    example: 'recovery-keys-not-set'
  })
  readonly message: string;

  constructor(message = 'recovery-keys-not-set') {
    this.message = message;
  }
}
