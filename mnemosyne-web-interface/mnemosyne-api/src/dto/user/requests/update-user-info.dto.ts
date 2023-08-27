import { IsOptional, IsString, Length } from 'class-validator';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class UpdateUserInfoDto {
  @IsOptional()
  @IsString({ message: ValidationErrorEnum.WRONG_FIRST_NAME_FORMAT })
  @Length(1, 64, { message: ValidationErrorEnum.WRONG_FIRST_NAME_LENGTH })
  readonly firstName: string;

  @IsOptional()
  @IsString({ message: ValidationErrorEnum.WRONG_LAST_NAME_FORMAT })
  @Length(1, 64, { message: ValidationErrorEnum.WRONG_LAST_NAME_LENGTH })
  readonly lastName: string;
}
