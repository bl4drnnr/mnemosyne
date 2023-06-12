import {
  IsBoolean,
  IsEmail,
  IsPhoneNumber,
  IsString,
  Length
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Should be email' })
  readonly email: string;

  @IsString({ message: 'Password should be a string' })
  @Length(8, 64, { message: 'Min length of password is 8, max is 64' })
  readonly password: string;

  @IsString({ message: 'First name should be a string' })
  @Length(1, 64, { message: 'Min length of first name is 1, max is 64' })
  readonly firstName: string;

  @IsString({ message: 'Last name should be a string' })
  @Length(1, 64, { message: 'Min length of last name is 1, max is 64' })
  readonly lastName: string;

  @IsPhoneNumber()
  readonly phone: string;

  @IsBoolean()
  readonly tac: boolean;
}
