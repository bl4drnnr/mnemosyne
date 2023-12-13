import {
  ArrayMaxSize,
  ArrayMinSize,
  IsString,
  Length,
  MaxLength
} from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class RecoverAccountDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PASSPHRASE_DESC,
    example: DocsProperty.PASSPHRASE_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_PASSPHRASE_FORMAT })
  @Length(8, 128, { message: ValidationError.WRONG_PASSPHRASE_LENGTH })
  readonly passphrase: string;

  @ApiProperty({
    type: Array<string>,
    description: DocsProperty.RECOVERY_KEYS_DESC,
    example: [
      DocsProperty.RECOVERY_KEY_EXAMPLE,
      DocsProperty.RECOVERY_KEY_EXAMPLE,
      DocsProperty.RECOVERY_KEY_EXAMPLE,
      DocsProperty.RECOVERY_KEY_EXAMPLE,
      DocsProperty.RECOVERY_KEY_EXAMPLE
    ],
    isArray: true,
    minLength: 5,
    maxLength: 5
  })
  @ArrayMinSize(5, { message: ValidationError.WRONG_REC_KEYS })
  @ArrayMaxSize(5, { message: ValidationError.WRONG_REC_KEYS })
  @MaxLength(1024, {
    each: true,
    message: ValidationError.WRONG_REC_KEYS
  })
  readonly recoveryKeys: Array<string>;
}
