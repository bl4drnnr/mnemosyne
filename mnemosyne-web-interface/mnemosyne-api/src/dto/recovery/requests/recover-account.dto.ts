import {
  ArrayMaxSize,
  ArrayMinSize,
  IsString,
  Length,
  MaxLength
} from 'class-validator';

export class RecoverAccountDto {
  @IsString({ message: 'wrong-passphrase-format' })
  @Length(8, 128, { message: 'wrong-passphrase-length' })
  readonly passphrase: string;

  @ArrayMinSize(5, { message: 'corrupted-recovery-keys' })
  @ArrayMaxSize(5, { message: 'corrupted-recovery-keys' })
  @MaxLength(1024, {
    each: true,
    message: 'corrupted-recovery-keys'
  })
  readonly recoveryKeys: Array<string>;
}
