import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class TokenTwoFaRequiredDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.TOKEN_TWO_FA_REQUIRED_DESC,
    example: DocsProperty.TOKEN_TWO_FA_REQUIRED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'token-two-fa-required') {
    this.message = message;
  }
}
