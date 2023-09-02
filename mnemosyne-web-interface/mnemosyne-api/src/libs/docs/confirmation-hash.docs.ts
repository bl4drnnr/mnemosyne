import { getSchemaPath, refs } from '@nestjs/swagger';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';
import { RecoveryKeysNotSetDto } from '@dto/recovery-keys-not-set.dto';
import { AccountConfirmedDto } from '@dto/account-confirmed.dto';
import { AccountAlreadyConfirmedException } from '@exceptions/account-already-confirmed.exception';
import { Language } from '@interfaces/language.enum';
import { UserDataNotSetDto } from '@dto/user-data-not-set.dto';
import { PasswordNotSetDto } from '@dto/password-not-set.dto';
import { CompanyAccountConfirmedDto } from '@dto/company-account-confirmed.dto';
import { CompanyMemberAccConfirmedDto } from '@dto/company-member-acc-confirmed.dto';
import { ConfirmCompanyAccDto } from '@dto/confirm-company-acc.dto';
import { HashNotFoundException } from '@exceptions/hash-not-found.exception';
import { FullMfaRequiredDto } from '@dto/full-mfa-required.dto';
import { TokenTwoFaRequiredDto } from '@dto/token-two-fa-required.dto';
import { PhoneMfaRequiredDto } from '@dto/phone-mfa-required.dto';
import { EmailChangedDto } from '@dto/email-changed.dto';
import { ConfirmEmailChangeDto } from '@dto/confirm-email-change.dto';
import { LinkExpiredException } from '@exceptions/link-expired.exception';
import { SmsExpiredException } from '@exceptions/sms-expired.exception';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { WrongCodeException } from '@exceptions/wrong-code.exception';
import { ResetUserPasswordDto } from '@dto/reset-user-password.dto';
import { PasswordResetDto } from '@dto/password-reset.dto';
import { PreviousPasswordException } from '@exceptions/previous-password.exception';
import { ApiBodyOptions } from '@nestjs/swagger/dist/decorators/api-body.decorator';

export abstract class ConfirmHashDocs {
  static get AccConfirm() {
    const ApiModels = [
      AccountConfirmedDto,
      MfaNotSetDto,
      RecoveryKeysNotSetDto,
      AccountAlreadyConfirmedException
    ];
    const ApiResponses = [
      MfaNotSetDto,
      RecoveryKeysNotSetDto,
      AccountConfirmedDto
    ];

    const apiOperationSum = 'Endpoint is responsible for account confirmation.';
    const apiResponseDesc =
      'As a response function returns either message that MFA has not been set or recovery keys have not been set or, after they both set, message that account is confirmed';
    const apiForbiddenRespDesc =
      'In case if account has already been confirmed, user gets the message.';

    const confirmHashQueryDesc = 'Confirmation hash';
    const langQueryDesc = 'Language that is going to be user in order to select the language of the email template, SMS message etc. Comes from FE localStorage from Transloco package.';

    const confirmHashQuery = {
      description: confirmHashQueryDesc,
      name: 'confirmationHash',
      type: String,
      required: true
    };

    const languageQuery = {
      description: langQueryDesc,
      name: 'language',
      enum: Language,
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
      ApiForbiddenResponse: {
        description: apiForbiddenRespDesc,
        schema: { $ref: getSchemaPath(AccountAlreadyConfirmedException) }
      },
      ApiConfirmHashQuery: confirmHashQuery,
      ApiLangQuery: languageQuery
    };
  }

  static get CompanyAccConfirm() {
    const ApiModels = [
      MfaNotSetDto,
      RecoveryKeysNotSetDto,
      UserDataNotSetDto,
      PasswordNotSetDto,
      CompanyAccountConfirmedDto,
      HashNotFoundException,
      AccountAlreadyConfirmedException
    ];
    const ApiResponses = [
      CompanyAccountConfirmedDto,
      MfaNotSetDto,
      RecoveryKeysNotSetDto,
      UserDataNotSetDto,
      PasswordNotSetDto
    ];

    const confirmHashQueryDesc = 'Confirmation hash';

    const confirmHashQuery = {
      description: confirmHashQueryDesc,
      name: 'confirmationHash',
      type: String,
      required: true
    };

    const apiOperationSum =
      'Endpoint is responsible for company account confirmation';
    const apiResponseDesc =
      'Response is similar to the response of normal account confirmation, but in this case, except MFA and recovery keys, user (company admin) will have to set up also personal data (first name and last name) and password.';
    const apiForbiddenDesc =
      'Forbidden error is thrown in case if account already confirmed.';
    const apiNotFoundDesc =
      'Not found exception is thrown in case if confirmation hash is not found.';
    const apiBodyDesc =
      'This endpoint is also responsible for account confirmation and setup of the person, who was assigned as primary admin during company account creation process.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { oneOf: refs(...ApiResponses) }
      },
      ApiForbiddenResponse: {
        description: apiForbiddenDesc,
        schema: { $ref: getSchemaPath(AccountAlreadyConfirmedException) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(HashNotFoundException) }
      },
      ApiBody: {
        type: ConfirmCompanyAccDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(ConfirmCompanyAccDto) }
      } as ApiBodyOptions,
      ApiConfirmHashQuery: confirmHashQuery
    };
  }

  static get CompanyMemberAccConfirm() {
    const ApiModels = [
      CompanyMemberAccConfirmedDto,
      MfaNotSetDto,
      RecoveryKeysNotSetDto,
      UserDataNotSetDto,
      PasswordNotSetDto,
      HashNotFoundException,
      AccountAlreadyConfirmedException
    ];
    const ApiResponses = [
      CompanyMemberAccConfirmedDto,
      MfaNotSetDto,
      RecoveryKeysNotSetDto,
      UserDataNotSetDto,
      PasswordNotSetDto
    ];

    const apiOperationSum =
      'Endpoint is responsible for company member account confirmation.';
    const apiResponseDesc =
      'Response is similar to the response of normal account confirmation, but in this case, except MFA and recovery keys, user (company admin) will have to set up also personal data (first name and last name) and password.';
    const apiForbiddenDesc =
      'Forbidden error is thrown in case if account already confirmed.';
    const apiNotFoundDesc =
      'Not found exception is thrown in case if confirmation hash is not found.';
    const apiBodyDesc =
      'This endpoint is also responsible for account confirmation and setup of the invited person, if the invited person did not have an account. Otherwise, the membership will be just confirmed.';

    const confirmHashQueryDesc = 'Confirmation hash';

    const confirmHashQuery = {
      description: confirmHashQueryDesc,
      name: 'confirmationHash',
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
      ApiForbiddenResponse: {
        description: apiForbiddenDesc,
        schema: { $ref: getSchemaPath(AccountAlreadyConfirmedException) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(HashNotFoundException) }
      },
      ApiBody: {
        type: ConfirmCompanyAccDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(ConfirmCompanyAccDto) }
      } as ApiBodyOptions,
      ApiConfirmHashQuery: confirmHashQuery
    };
  }

  static get EmailChangeConfirm() {
    const ApiModels = [
      EmailChangedDto,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto,
      HashNotFoundException,
      LinkExpiredException,
      SmsExpiredException,
      WrongCredentialsException,
      WrongCodeException
    ];
    const ApiResponses = [
      EmailChangedDto,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto
    ];
    const BadRequests = [
      SmsExpiredException,
      WrongCredentialsException,
      WrongCodeException
    ];
    const NotFound = [HashNotFoundException, LinkExpiredException];

    const apiOperationSum =
      'Endpoint is responsible for email change confirmation';
    const apiResponseDesc =
      'As a response user gets information that email change has been confirmed, but before that they need to verify their identity with password and MFA.';
    const apiNotFoundDesc =
      'Not found error is thrown in case if link (confirmation hash) has expired.';
    const apiBadRequestRespDesc =
      'Bad request responses include wrong provided MFA code, or expired MFA code, or wrong provided credentials.';
    const apiBodyDesc =
      'While email change confirmation user has to provide confirmation data about their account. It includes: password, MFA code and/or mobile phone code.';

    const confirmHashQueryDesc = 'Confirmation hash';

    const confirmHashQuery = {
      description: confirmHashQueryDesc,
      name: 'confirmationHash',
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
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: refs(...NotFound) }
      },
      ApiBody: {
        type: ConfirmEmailChangeDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(ConfirmEmailChangeDto) }
      } as ApiBodyOptions,
      ApiConfirmHashQuery: confirmHashQuery
    };
  }

  static get ResetUserPasswordConfirmation() {
    const ApiModels = [
      PasswordResetDto,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto,
      HashNotFoundException,
      LinkExpiredException,
      PreviousPasswordException,
      SmsExpiredException,
      WrongCredentialsException,
      WrongCodeException
    ];
    const ApiResponses = [
      PasswordResetDto,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto
    ];
    const BadRequests = [
      SmsExpiredException,
      WrongCredentialsException,
      WrongCodeException,
      PreviousPasswordException
    ];
    const NotFound = [HashNotFoundException, LinkExpiredException];

    const apiOperationSum =
      'Endpoint is responsible for user reset password confirmation.';
    const apiResponseDesc =
      'As a response user gets information that new password is set, but before that they need to verify their identity with password and MFA.';
    const apiBadRequestRespDesc =
      'Bad request responses include wrong provided MFA code, or expired MFA code, or wrong provided credentials or that the previous password is used.';
    const apiNotFoundDesc =
      'Not found exceptions are thrown in case if either hash not found or link expired.';
    const apiBodyDesc =
      'While reset password confirmation user has to provide confirmation data about their account. It includes: password, MFA code and/or mobile phone code.';

    const confirmHashQueryDesc = 'Confirmation hash';

    const confirmHashQuery = {
      description: confirmHashQueryDesc,
      name: 'confirmationHash',
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
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { oneOf: refs(...NotFound) }
      },
      ApiBody: {
        type: ResetUserPasswordDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(ResetUserPasswordDto) }
      } as ApiBodyOptions,
      ApiConfirmHashQuery: confirmHashQuery
    };
  }
}
