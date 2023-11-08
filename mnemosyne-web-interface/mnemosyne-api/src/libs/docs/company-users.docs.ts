import { getSchemaPath } from '@nestjs/swagger';
import { InviteUserToCompanyDto } from '@dto/invite-user-to-company.dto';
import { UserInvitedDto } from '@dto/user-invited.dto';

export abstract class CompanyUsersDocs {
  static get InviteUser() {
    const ApiModels = [InviteUserToCompanyDto, UserInvitedDto];

    const apiOperationSum = 'Endpoint is responsible for user invitation to the company.';
    const apiResponseDesc = '';
    const apiBodyDesc = 'In order to invite the user to the company the member of the company with the administrator role has to provide an email of the user along with the their role.';

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
