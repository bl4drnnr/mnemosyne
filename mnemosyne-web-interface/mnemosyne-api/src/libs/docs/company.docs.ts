import { getSchemaPath, refs } from '@nestjs/swagger';
import { CompanyCreatedDto } from '@dto/company-created.dto';
import { TacNotAcceptedException } from '@exceptions/tac-not-accepted.exception';
import { CompanyExistsException } from '@exceptions/company-exists.exception';
import { CreateCompanyDto } from '@dto/create-company.dto';
import { ApiBodyOptions } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { GetCompanyByIdDto } from '@dto/get-company-by-id.dto';
import { ParseException } from '@exceptions/parse.exception';
import { UpdateCompanyDto } from '@dto/update-company.dto';
import { CompanyUpdatedDto } from '@dto/company-updated.dto';
import { GetCompanyUsersDto } from '@dto/get-company-users.dto';
import { FullMfaRequiredDto } from '@dto/full-mfa-required.dto';
import { TokenTwoFaRequiredDto } from '@dto/token-two-fa-required.dto';
import { PhoneMfaRequiredDto } from '@dto/phone-mfa-required.dto';
import { CompanyDeletedDto } from '@dto/company-deleted.dto';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { WrongRecoveryKeysException } from '@exceptions/wrong-recovery-keys.exception';
import { DeleteCompanyDto } from '@dto/delete-company.dto';
import { TransferOwnershipDto } from '@dto/transfer-ownership.dto';
import { CompanyOwnershipTransferredDto } from '@dto/company-ownership-transferred.dto';
import { UserNotFoundException } from '@exceptions/user-not-found.exception';
import { RoleDoesntExistException } from '@exceptions/role-doesnt-exist.exception';
import { SmsExpiredException } from '@exceptions/sms-expired.exception';
import { WrongCodeException } from '@exceptions/wrong-code.exception';

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

  static get GetCompanyInfo() {
    const ApiModels = [GetCompanyByIdDto];

    const apiOperationSum =
      'Endpoint is responsible for getting information about the company by ID.';
    const apiResponseDesc =
      'As a response endpoint returns information about the company by ID.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(GetCompanyByIdDto) }
      }
    };
  }

  static get GetCompanyUsers() {
    const ApiModels = [GetCompanyUsersDto, ParseException];

    const apiOperationSum =
      'Endpoint is responsible for getting the list of all users in company with pagination.';
    const apiResponseDesc =
      'As the response user gets the list of all users along with count for pagination.';
    const apiBadRequestRespDesc =
      'Parse exception is thrown in case if page or limit params cannot be parsed as number.';

    const pageSizeQueryDesc =
      'Query for limit in order to get list of company users.';
    const pageQueryDesc =
      'Query for page in order to get list of company users.';

    const pageSizeQuery = {
      description: pageSizeQueryDesc,
      name: 'pageSize',
      type: String,
      required: true
    };

    const pageQuery = {
      description: pageQueryDesc,
      name: 'page',
      type: String,
      required: true
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(GetCompanyUsersDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(ParseException) }
      },
      ApiPageSizeQuery: pageSizeQuery,
      ApiPageQuery: pageQuery
    };
  }

  static get UpdateCompanyInformation() {
    const ApiModels = [CompanyUpdatedDto, UpdateCompanyDto];

    const apiOperationSum =
      'Endpoint is responsible for updating company information.';
    const apiResponseDesc =
      'As a response user (with administrator permissions) gets message that information has been updated';
    const apiBodyDesc = 'Body contains company information.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(CompanyUpdatedDto) }
      },
      ApiBody: {
        type: UpdateCompanyDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(UpdateCompanyDto) }
      } as ApiBodyOptions
    };
  }

  static get TransferCompanyOwnership() {
    const ApiModels = [
      TransferOwnershipDto,
      UserNotFoundException,
      RoleDoesntExistException,
      CompanyOwnershipTransferredDto,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto,
      SmsExpiredException,
      WrongCredentialsException,
      WrongCodeException
    ];
    const ApiResponses = [
      CompanyOwnershipTransferredDto,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto
    ];
    const BadRequests = [
      SmsExpiredException,
      WrongCredentialsException,
      WrongCodeException
    ];

    const apiOperationSum =
      'Endpoint is responsible for transferring the ownership of the account.';
    const apiResponseDesc =
      'As a response user gets a message that ownership has been transferred or anything else related to MFA.';
    const apiBadRequestRespDesc =
      'Bad request error is thrown in case if there is something wrong with MFA.';
    const apiNotFoundDesc =
      'Not found error is thrown in case if user has not been found.';
    const apiBodyDesc =
      'Body contains new owner email and role id for the old owner along with MFA.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { oneOf: refs(...ApiResponses) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(UserNotFoundException) }
      },
      ApiBody: {
        type: TransferOwnershipDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(TransferOwnershipDto) }
      } as ApiBodyOptions
    };
  }

  static get DeleteCompanyAccount() {
    const ApiModels = [
      DeleteCompanyDto,
      CompanyDeletedDto,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto,
      WrongCredentialsException,
      WrongRecoveryKeysException
    ];
    const ApiResponses = [
      CompanyDeletedDto,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto
    ];
    const BadRequests = [WrongCredentialsException, WrongRecoveryKeysException];

    const apiOperationSum =
      'Endpoint is responsible for deletion of the company account.';
    const apiResponseDesc =
      'As the response endpoint returns MFA requirement and after MFA is provided correctly, the message that the company has been deleted.';
    const apiBadRequestRespDesc =
      'In case if either user provided the wrong password or provided wrong recovery keys, the bad request error will be thrown.';
    const apiBodyDesc =
      'In the body user provides MFA code(s), recovery keys with the passphrase, and the password';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { oneOf: refs(...ApiResponses) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiBody: {
        type: DeleteCompanyDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(DeleteCompanyDto) }
      } as ApiBodyOptions
    };
  }
}
