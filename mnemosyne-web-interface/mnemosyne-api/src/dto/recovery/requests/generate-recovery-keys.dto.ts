import { IsString, Length } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class GenerateRecoveryKeysDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PASSPHRASE_DESC,
    example: DocsProperty.PASSPHRASE_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_PASSPHRASE_FORMAT })
  @Length(8, 128, { message: ValidationError.WRONG_PASSPHRASE_LENGTH })
  readonly passphrase: string;
}
