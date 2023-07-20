import { IsBoolean, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @Matches(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    { message: 'Wrong email format' }
  )
  readonly email: string;

  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'Wrong password format'
  })
  readonly password: string;

  @IsString({ message: 'First name should be a string' })
  @Length(1, 64, { message: 'Min length of first name is 1, max is 64' })
  readonly firstName: string;

  @IsString({ message: 'Last name should be a string' })
  @Length(1, 64, { message: 'Min length of last name is 1, max is 64' })
  readonly lastName: string;

  @IsBoolean()
  readonly tac: boolean;
}
