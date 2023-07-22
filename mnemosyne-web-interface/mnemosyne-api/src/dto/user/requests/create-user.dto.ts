import {IsBoolean, IsFQDN, IsOptional, IsString, Length, Matches} from 'class-validator';

export class CreateUserDto {
  @Matches(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    { message: 'wrong-email-format' }
  )
  readonly email: string;

  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'wrong-password-format'
  })
  readonly password: string;

  @IsString({ message: 'wrong-first-name-format' })
  @Length(1, 64, { message: 'wrong-first-name-length' })
  readonly firstName: string;

  @IsString({ message: 'wrong-last-name-format' })
  @Length(1, 64, { message: 'wrong-last-name-length' })
  readonly lastName: string;

  @IsOptional()
  @IsString({ message: 'wrong-location-format' })
  @Length(8, 128, { message: 'wrong-location-length' })
  readonly location: string;

  @IsOptional()
  @IsString({ message: 'wrong-company-format' })
  @Length(2, 64, { message: 'wrong-company-length' })
  readonly company: string;

  @IsOptional()
  @IsString({ message: 'wrong-fqdn' })
  @IsFQDN()
  readonly website: string;

  @IsBoolean()
  readonly tac: boolean;
}
