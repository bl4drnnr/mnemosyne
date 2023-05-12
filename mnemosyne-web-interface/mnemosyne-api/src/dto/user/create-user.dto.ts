import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Should be email' })
  readonly email: string;

  @IsString({ message: 'Should be string' })
  @Length(8, 64, { message: 'Min length of password is 8, max is 64' })
  readonly password: string;
}
