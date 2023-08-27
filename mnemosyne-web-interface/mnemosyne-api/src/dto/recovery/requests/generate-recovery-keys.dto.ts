import { IsString, Length } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';

export class GenerateRecoveryKeysDto {
  @IsString({ message: ValidationError.WRONG_PASSPHRASE_FORMAT })
  @Length(8, 128, { message: ValidationError.WRONG_PASSPHRASE_LENGTH })
  readonly passphrase: string;
}
