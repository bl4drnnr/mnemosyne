import { IsString, Length } from 'class-validator';

export class GenerateRecoveryKeysDto {
  @IsString({ message: 'wrong-passphrase-format' })
  @Length(8, 128, { message: 'wrong-passphrase-length' })
  readonly passphrase: string;
}
