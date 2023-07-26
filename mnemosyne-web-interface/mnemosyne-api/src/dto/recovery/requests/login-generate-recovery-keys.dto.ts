import { IsString, Length, Matches } from 'class-validator';

export class LoginGenerateRecoveryKeysDto {
  @IsString({ message: 'wrong-passphrase-format' })
  @Length(8, 128, { message: 'wrong-passphrase-length' })
  readonly passphrase: string;

  @Matches(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    { message: 'wrong-email-format' }
  )
  readonly email: string;

  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'wrong-password-format'
  })
  readonly password: string;
}
