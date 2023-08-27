import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsFQDN,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested
} from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { Type } from 'class-transformer';
import { Language } from '@interfaces/language.enum';
import { CompanyMembersType } from '@custom-types/company-members.type';
import { MemberRoleDto } from '@dto/member-role.dto';
import { ValidationError } from '@interfaces/validation-error.enum';

export class CreateCompanyDto {
  @IsString({ message: ValidationError.WRONG_LOCATION_FORMAT })
  @Length(8, 128, { message: ValidationError.WRONG_LOCATION_LENGTH })
  readonly companyLocation: string;

  @IsString({ message: ValidationError.WRONG_COMPANY_FORMAT })
  @Length(2, 64, { message: ValidationError.WRONG_COMPANY_LENGTH })
  readonly companyName: string;

  @IsString({ message: ValidationError.WRONG_FQDN })
  @IsFQDN()
  readonly companyWebsite: string;

  @Matches(EmailRegex, { message: ValidationError.WRONG_EMAIL_FORMAT })
  readonly companyOwnerEmail: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(5)
  @Type(() => MemberRoleDto)
  readonly companyMembers: CompanyMembersType;

  @IsBoolean()
  readonly tac: boolean;

  @IsOptional()
  @IsEnum(Language)
  readonly language: Language;
}
