import { getSchemaPath } from '@nestjs/swagger';
import { InviteUserToCompanyDto } from '@dto/invite-user-to-company.dto';
import { UserInvitedDto } from '@dto/user-invited.dto';

export abstract class CompanyUsersDocs {
  static get InviteUser() {
    const ApiModels = [InviteUserToCompanyDto, UserInvitedDto];

    const apiOperationSum = '';
    const apiResponseDesc = '';
    const apiBodyDesc = '';

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
}
