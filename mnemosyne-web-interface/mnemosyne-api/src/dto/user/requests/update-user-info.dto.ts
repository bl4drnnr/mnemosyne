import { IsFQDN, IsString, Length } from 'class-validator';

export class UpdateUserInfoDto {
  @IsString({ message: 'wrong-first-name-format' })
  @Length(1, 64, { message: 'wrong-first-name-length' })
  readonly firstName: string;

  @IsString({ message: 'wrong-last-name-format' })
  @Length(1, 64, { message: 'wrong-last-name-length' })
  readonly lastName: string;

  @IsString({ message: 'wrong-location-format' })
  @Length(8, 128, { message: 'wrong-location-length' })
  readonly location: string;

  @IsString({ message: 'wrong-company-format' })
  @Length(2, 64, { message: 'wrong-company-length' })
  readonly company: string;

  @IsString({ message: 'wrong-fqdn' })
  @IsFQDN()
  readonly website: string;
}
