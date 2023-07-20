import {IsString, Length} from "class-validator";

export class UpdateUserInfoDto {
  @IsString({ message: 'First name should be a string' })
  @Length(1, 64, { message: 'Min length of first name is 1, max is 64' })
  readonly firstName: string;

  @IsString({ message: 'Last name should be a string' })
  @Length(1, 64, { message: 'Min length of last name is 1, max is 64' })
  readonly lastName: string;
}
