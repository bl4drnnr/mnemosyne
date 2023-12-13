import { getSchemaPath } from '@nestjs/swagger';
import { GetCompanyRolesDto } from '@dto/get-company-roles.dto';
import { CompanyRoleUpdatedDto } from '@dto/company-role-updated.dto';
import { RoleDoesntExistException } from '@exceptions/role-doesnt-exist.exception';
import { ApiBodyOptions } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { UpdateCompanyRoleDto } from '@dto/update-company-role.dto';

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

  static get UpdateCompanyRole() {
    const ApiModels = [
      UpdateCompanyRoleDto,
      CompanyRoleUpdatedDto,
      RoleDoesntExistException
    ];

    const apiOperationSum =
      'Endpoint is responsible for updating the company role.';
    const apiResponseDesc =
      'As a response user gets message that the role has been successfully updated.';
    const apiNotFoundDesc =
      'In case if the name of role has been modified and the company does not have this role Not Found exception will be thrown.';
    const apiBodyDesc =
      'In the body user provides the same fields as for role creation.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(CompanyRoleUpdatedDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(RoleDoesntExistException) }
      },
      ApiBody: {
        type: UpdateCompanyRoleDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(UpdateCompanyRoleDto) }
      } as ApiBodyOptions
    };
  }
}
