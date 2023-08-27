import {
  ArrayMaxSize,
  ArrayMinSize,
  IsString,
  Length,
  MaxLength
} from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';

export class RecoverAccountDto {
  @IsString({ message: ValidationError.WRONG_PASSPHRASE_FORMAT })
  @Length(8, 128, { message: ValidationError.WRONG_PASSPHRASE_LENGTH })
  readonly passphrase: string;

  @ArrayMinSize(5, { message: ValidationError.WRONG_REC_KEYS })
  @ArrayMaxSize(5, { message: ValidationError.WRONG_REC_KEYS })
  @MaxLength(1024, {
    each: true,
    message: ValidationError.WRONG_REC_KEYS
  })
  readonly recoveryKeys: Array<string>;
}
