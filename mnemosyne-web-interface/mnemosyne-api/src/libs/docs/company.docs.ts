import { getSchemaPath } from '@nestjs/swagger';
import { CompanyCreatedDto } from '@dto/company-created.dto';
import { TacNotAcceptedException } from '@exceptions/tac-not-accepted.exception';
import { CompanyExistsException } from '@exceptions/company-exists.exception';
import { CreateCompanyDto } from '@dto/create-company.dto';
import { ApiBodyOptions } from '@nestjs/swagger/dist/decorators/api-body.decorator';

export abstract class CompanyDocs {
  static get CreateCompany() {
    const ApiModels = [
      CreateCompanyDto,
      CompanyCreatedDto,
      TacNotAcceptedException,
      CompanyExistsException
    ];

    const apiOperationSum = 'Endpoint is responsible for company creation.';
    const apiResponseDesc =
      'As a response function returns message about created company.';
    const apiForbiddenRespDesc =
      'Forbidden response for company creation includes only response saying that company has not accepted Terms & Conditions.';
    const apiBadRequestRespDesc =
      'Bad request is returned in case if company is already exists.';
    const apiBodyDesc =
      'In order to create a company account user has to provide company name, location, website, owner email, list of company members (optional) and accept T&C.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(CompanyCreatedDto) }
      },
      ApiForbiddenResponse: {
        description: apiForbiddenRespDesc,
        schema: { $ref: getSchemaPath(TacNotAcceptedException) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(CompanyExistsException) }
      },
      ApiBody: {
        type: CreateCompanyDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(CreateCompanyDto) }
      } as ApiBodyOptions
    };
  }
}
