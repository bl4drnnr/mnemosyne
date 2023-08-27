import { IsString, Length } from 'class-validator';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class GenerateRecoveryKeysDto {
  @IsString({ message: ValidationErrorEnum.WRONG_PASSPHRASE_FORMAT })
  @Length(8, 128, { message: ValidationErrorEnum.WRONG_PASSPHRASE_LENGTH })
  readonly passphrase: string;
}
