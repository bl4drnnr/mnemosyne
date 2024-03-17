import { getSchemaPath } from '@nestjs/swagger';
import { GetCompanyRolesDto } from '@dto/get-company-roles.dto';
import { CompanyRoleUpdatedDto } from '@dto/company-role-updated.dto';
import { RoleDoesntExistException } from '@exceptions/role-doesnt-exist.exception';
import { ApiBodyOptions } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { UpdateCompanyRoleDto } from '@dto/update-company-role.dto';
import { CreateCompanyRoleDto } from '@dto/create-company-role.dto';
import { CompanyRoleCreatedDto } from '@dto/company-role-created.dto';
import { RoleAlreadyExistsException } from '@exceptions/role-already-exists.exception';

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

  static get CreateRole() {
    const ApiModels = [
      CreateCompanyRoleDto,
      CompanyRoleCreatedDto,
      RoleAlreadyExistsException
    ];

    const apiOperationSum =
      'Endpoint is responsible for the creation of the custom company role.';
    const apiResponseDesc =
      'As a response user gets the message with the information that the role has been successfully created.';
    const apiBodyDesc =
      'In the body user has to provide the name, description, scopes and assignees for the new role.';
    const apiBadRequestRespDesc =
      'Bad request error is thrown in case if the role with this name in the company already exists.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(CompanyRoleCreatedDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(RoleAlreadyExistsException) }
      },
      ApiBody: {
        type: CreateCompanyRoleDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(CreateCompanyRoleDto) }
      } as ApiBodyOptions
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
