import { getSchemaPath } from '@nestjs/swagger';
import { InviteUserToCompanyDto } from '@dto/invite-user-to-company.dto';
import { UserInvitedDto } from '@dto/user-invited.dto';
import { CompanyMemberInfoDto } from '@dto/company-member-info.dto';
import { CompanyMemberNotFoundException } from '@exceptions/company-member-not-found.exception';
import { UpdateUserInfoDto } from '@dto/update-user-info.dto';
import { ApiBodyOptions } from '@nestjs/swagger/dist/decorators/api-body.decorator';

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

  // @TODO Write docs
  static get DeleteCompanyMember() {
    const apiOperationSum = '';
    return {};
  }
}
