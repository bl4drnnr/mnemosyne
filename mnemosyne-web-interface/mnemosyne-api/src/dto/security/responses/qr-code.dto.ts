import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class QrCodeDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.QR_CODE_LINK_DESC,
    example: DocsProperty.QR_CODE_LINK_EXAMPLE
  })
  readonly qr: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.TWO_FA_TOKEN_DESC,
    example: DocsProperty.TWO_FA_TOKEN_EXAMPLE
  })
  readonly secret: string;

  constructor({ qr, secret }: { qr: string; secret: string }) {
    this.qr = qr;
    this.secret = secret;
  }
}
