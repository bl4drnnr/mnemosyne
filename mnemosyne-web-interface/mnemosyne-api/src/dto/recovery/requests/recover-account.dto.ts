import { IsString, Length } from 'class-validator';

export class RecoverAccountDto {
  @IsString({ message: 'wrong-passphrase-format' })
  @Length(8, 128, { message: 'wrong-passphrase-length' })
  readonly passphrase: string;

  readonly recoveryKeys: Array<string>;
}
