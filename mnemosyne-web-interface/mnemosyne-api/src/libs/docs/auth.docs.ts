import { getSchemaPath, refs } from '@nestjs/swagger';
import { LogInUserDto, LogInUserResponseDto } from '@dto/log-in-user.dto';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';
import { RecoveryKeysNotSetDto } from '@dto/recovery-keys-not-set.dto';
import { FullMfaRequiredDto } from '@dto/full-mfa-required.dto';
import { TokenTwoFaRequiredDto } from '@dto/token-two-fa-required.dto';
import { PhoneMfaRequiredDto } from '@dto/phone-mfa-required.dto';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { AccountNotConfirmedException } from '@exceptions/account-not-confirmed.exception';
import { SmsExpiredException } from '@exceptions/sms-expired.exception';
import { WrongCodeException } from '@exceptions/wrong-code.exception';
import { CreateUserDto } from '@dto/create-user.dto';
import { UserAlreadyExistsException } from '@exceptions/user-already-exists.exception';
import { TacNotAcceptedException } from '@exceptions/tac-not-accepted.exception';
import { UserCreatedDto } from '@dto/user-created.dto';
import { LoggedOutDto } from '@dto/logged-out.dto';
import { CorruptedTokenException } from '@exceptions/corrupted-token.exception';
import { InvalidTokenException } from '@exceptions/invalid-token.exception';
import { ExpiredTokenException } from '@exceptions/expired-token.exception';

export abstract class AuthDocs {
  static get Login() {
    const ApiModels = [
      LogInUserResponseDto,
      MfaNotSetDto,
      RecoveryKeysNotSetDto,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto,
      WrongCredentialsException,
      AccountNotConfirmedException,
      SmsExpiredException,
      WrongCodeException
    ];
    const ApiResponses = [
      MfaNotSetDto,
      RecoveryKeysNotSetDto,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto
    ];
    const BadRequests = [
      SmsExpiredException,
      WrongCredentialsException,
      WrongCodeException
    ];

    const apiOperationSum = 'Endpoint is responsible for user login.';
    const apiResponseDesc =
      'As a response function returns 2 tokens - refresh and access. Also, as a response user may get a message that either token or phone MFA is required or both of them. It is sent as a message (status 201), not an error.';
    const apiBadRequestRespDesc =
      'Bad request responses include wrong provided MFA code, or expired MFA code, or wrong provided credentials.';
    const apiForbiddenRespDesc =
      'Forbidden response for login includes only response saying that user account has not been confirmed. It means, that it exists, but user have not clicked the link in the message.';
    const apiBodyDesc =
      'According to the requirements, all users will have to configure MFA for their accounts. Therefore, even tho both MFA codes are optional, at least one of them will be provided.';

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
      ApiForbiddenResponse: {
        description: apiForbiddenRespDesc,
        schema: { $ref: getSchemaPath(AccountNotConfirmedException) }
      },
      ApiBody: {
        type: LogInUserDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(LogInUserDto) }
      }
    };
  }

  static get Registration() {
    const ApiModels = [
      UserCreatedDto,
      UserAlreadyExistsException,
      TacNotAcceptedException
    ];

    const apiOperationSum = 'Endpoint is responsible for user registration.';
    const apiResponseDesc =
      'As a response function returns message about created user.';
    const apiBadRequestRespDesc =
      'User gets bad request response in case if user already exists.';
    const apiForbiddenRespDesc =
      'Forbidden response for registration includes only response saying that user has not accepted Terms & Conditions.';
    const apiBodyDesc =
      'In order to create an account user has to provide email, password, first name and last name, and accept T&C.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(UserCreatedDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(UserAlreadyExistsException) }
      },
      ApiForbiddenResponse: {
        description: apiForbiddenRespDesc,
        schema: { $ref: getSchemaPath(TacNotAcceptedException) }
      },
      ApiBody: {
        type: CreateUserDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(CreateUserDto) }
      }
    };
  }

  static get Logout() {
    const ApiModels = [LoggedOutDto];

    const apiOperationSum = 'Endpoint is responsible for user log out.';
    const apiResponseDesc =
      'As a response function returns message about that user was logged out and refresh token cleaned from token.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(LoggedOutDto) }
      }
    };
  }

  static get RefreshTokens() {
    const ApiModels = [
      CorruptedTokenException,
      InvalidTokenException,
      LogInUserResponseDto,
      ExpiredTokenException
    ];
    const BadRequests = [InvalidTokenException, CorruptedTokenException];

    const apiOperationSum = 'Endpoint is responsible for refresh tokens.';
    const apiResponseDesc =
      'As a response function returns 2 tokens - refresh and access. But in compare with login function, this function always returns 2 tokens, without asking for MFA etc.';
    const apiBadRequestRespDesc =
      'Bad requests can return in case of invalid tokens or corrupted tokens.';
    const apiUnauthorizedRespDesc =
      'Unauthorized error can be returned in case of if token is expired.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(LogInUserResponseDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiUnauthorizedResponse: {
        description: apiUnauthorizedRespDesc,
        schema: { $ref: getSchemaPath(ExpiredTokenException) }
      }
    };
  }
}
