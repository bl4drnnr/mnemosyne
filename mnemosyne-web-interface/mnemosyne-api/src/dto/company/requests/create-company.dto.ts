import {
  ArrayMaxSize,
  IsArray,
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

export class CreateCompanyDto {
  @IsString({ message: 'wrong-location-format' })
  @Length(8, 128, { message: 'wrong-location-length' })
  readonly companyLocation: string;

  @IsString({ message: 'wrong-company-format' })
  @Length(2, 64, { message: 'wrong-company-length' })
  readonly companyName: string;

  @IsString({ message: 'wrong-fqdn' })
  @IsFQDN()
  readonly companyWebsite: string;

  @Matches(EmailRegex, { message: 'wrong-email-format' })
  readonly companyOwnerEmail: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(5)
  @Type(() => MemberRoleDto)
  readonly companyMembers: CompanyMembersType;

  @IsOptional()
  @IsEnum(Language)
  readonly language: Language;
}
