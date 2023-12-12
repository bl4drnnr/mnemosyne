import { getSchemaPath } from '@nestjs/swagger';
import { GetCompanyRolesDto } from '@dto/get-company-roles.dto';

export abstract class RolesDocs {
  static get GetCompanyRoles() {
    const ApiModels = [GetCompanyRolesDto];

    const apiOperationSum =
      'Endpoint is responsible for getting all roles of the company.';
    const apiResponseDesc =
      'As a response user gets the array with all roles, their names, descriptions and scopes.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(GetCompanyRolesDto) }
      }
    };
  }
}
