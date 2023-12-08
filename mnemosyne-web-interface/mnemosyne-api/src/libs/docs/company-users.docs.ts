import { getSchemaPath, refs } from '@nestjs/swagger';
import { InviteUserToCompanyDto } from '@dto/invite-user-to-company.dto';
import { UserInvitedDto } from '@dto/user-invited.dto';
import { CompanyMemberInfoDto } from '@dto/company-member-info.dto';
import { CompanyMemberNotFoundException } from '@exceptions/company-member-not-found.exception';
import { UpdateUserInfoDto } from '@dto/update-user-info.dto';
import { ApiBodyOptions } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { CompanyMemberDeletedDto } from '@dto/company-member-deleted.dto';
import { FullMfaRequiredDto } from '@dto/full-mfa-required.dto';
import { TokenTwoFaRequiredDto } from '@dto/token-two-fa-required.dto';
import { PhoneMfaRequiredDto } from '@dto/phone-mfa-required.dto';
import { DeleteCompanyMemberDto } from '@dto/delete-company-member.dto';

export abstract class CompanyUsersDocs {
  static get InviteUser() {
    const ApiModels = [InviteUserToCompanyDto, UserInvitedDto];

    const apiOperationSum =
      'Endpoint is responsible for user invitation to the company.';
    const apiResponseDesc =
      'As a response user gets message that user has been invited.';
    const apiBodyDesc =
      'In order to invite the user to the company the member of the company with the administrator role has to provide an email of the user along with the their role.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(UserInvitedDto) }
      },
      ApiBody: {
        type: InviteUserToCompanyDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(InviteUserToCompanyDto) }
      }
    };
  }

  static get GetCompanyMemberInfo() {
    const ApiModels = [CompanyMemberInfoDto, CompanyMemberNotFoundException];

    const apiOperationSum =
      'Endpoint is responsible for obtaining the information about company member by ID.';
    const apiResponseDesc =
      'As a response user gets information about company user.';
    const apiNotFoundDesc =
      'In case if user ID has been modified and user not found, endpoint returns the error of user not found.';

    const memberIdQueryDesc = 'User (company member) ID.';

    const memberIdQuery = {
      description: memberIdQueryDesc,
      name: 'memberId',
      type: String,
      required: true
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(CompanyMemberInfoDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(CompanyMemberNotFoundException) }
      },
      ApiMemberIdQuery: memberIdQuery
    };
  }

  static get UpdateCompanyMemberInfo() {
    const ApiModels = [
      UpdateUserInfoDto,
      CompanyMemberInfoDto,
      CompanyMemberNotFoundException
    ];

    const apiOperationSum =
      'Endpoint is responsible for updating the information of the company member.';
    const apiResponseDesc =
      'As a response user gets message that information has been updated';
    const apiBodyDesc = 'Body contains user personal information.';
    const apiNotFoundDesc =
      'In case if user ID has been modified and user not found, endpoint returns the error of user not found.';

    const memberIdQueryDesc = 'User (company member) ID.';

    const memberIdQuery = {
      description: memberIdQueryDesc,
      name: 'memberId',
      type: String,
      required: true
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(CompanyMemberInfoDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(CompanyMemberNotFoundException) }
      },
      ApiBody: {
        type: UpdateUserInfoDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(UpdateUserInfoDto) }
      } as ApiBodyOptions,
      ApiMemberIdQuery: memberIdQuery
    };
  }

  static get DeleteCompanyMember() {
    const ApiModels = [
      DeleteCompanyMemberDto,
      CompanyMemberDeletedDto,
      CompanyMemberNotFoundException,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto
    ];
    const ApiResponses = [
      CompanyMemberDeletedDto,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto
    ];

    const apiOperationSum =
      'Endpoint is responsible for deleting user from the company.';
    const apiResponseDesc =
      'In order to perform this action the MFA is required. Therefore, except the response that the user has been deleted, the user might get the response with the MFA requirement.';
    const apiNotFoundDesc =
      'In case if memberId was modified, or memberId of the different company was provided, endpoint returns not found error message.';
    const apiBodyDesc = 'In the body user has to provide MFA code(s).';

    const memberIdQueryDesc = 'User (company member) ID.';

    const memberIdQuery = {
      description: memberIdQueryDesc,
      name: 'memberId',
      type: String,
      required: true
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { oneOf: refs(...ApiResponses) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(CompanyMemberNotFoundException) }
      },
      ApiBody: {
        type: DeleteCompanyMemberDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(DeleteCompanyMemberDto) }
      } as ApiBodyOptions,
      ApiMemberIdQuery: memberIdQuery
    };
  }
}
