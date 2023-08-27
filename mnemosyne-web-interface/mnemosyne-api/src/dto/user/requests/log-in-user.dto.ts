import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class LogInUserDto {
  @ApiProperty({
    type: String,
    description: 'Email address',
    example: 'joe@doe.com'
  })
  @Matches(EmailRegex, { message: ValidationErrorEnum.WRONG_EMAIL_FORMAT })
  readonly email: string;

  @ApiProperty({
    type: String,
    description: 'User password',
    example: '78ui&*UI'
  })
  @Matches(PasswordRegex, {
    message: ValidationErrorEnum.WRONG_PASSWORD_FORMAT
  })
  readonly password: string;

  @ApiProperty({
    type: String,
    description: 'User phone code - MFA',
    example: '123123'
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: ValidationErrorEnum.WRONG_PHONE_CODE_FORMAT })
  @Length(6, 6, { message: ValidationErrorEnum.WRONG_PHONE_CODE_FORMAT })
  readonly phoneCode?: string;

  @ApiProperty({
    type: String,
    description: 'User authentication application code - MFA',
    example: '123123'
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: ValidationErrorEnum.WRONG_MFA_CODE_FORMAT })
  @Length(6, 6, { message: ValidationErrorEnum.WRONG_MFA_CODE_FORMAT })
  readonly mfaCode?: string;
}

export class LogInUserResponseDto {
  @ApiProperty({
    type: String,
    description: 'Authentication token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJERUZBVUxUIl0sInVzZXJJZCI6IjU4NGE3MzYzLWYxMmYtNGYxMy04NmQ1LTgxZWEwNzI5Y2I1MSIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE2OTMxMzc2MDYsImV4cCI6MTY5MzE0NDgwNn0.c29vRfkNAbYi1stsn5EsN0N7ruUKrzkZe7RZpUDwu0U'
  })
  readonly _at: string;

  @ApiProperty({
    type: String,
    description: 'Refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwNjY5MzYxLTc3ODgtNGJlNC05ZWNkLTAxNjcyM2FjMWU2MyIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjkzMTM3NjA2LCJleHAiOjE2OTM3NDI0MDZ9.eLt3U9RFbh_iRy1MpH30VIyCSMp6mxEw1Yw9MLEsvGU'
  })
  readonly _rt: string;
}
