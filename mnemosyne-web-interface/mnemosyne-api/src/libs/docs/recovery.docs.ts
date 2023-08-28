import { getSchemaPath } from '@nestjs/swagger';
import { GenerateRecoveryKeysDto } from '@dto/generate-recovery-keys.dto';
import { HashNotFoundException } from '@exceptions/hash-not-found.exception';
import { RecoveryKeysResponseDto } from '@dto/recovery-keys.dto';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { LoginGenerateRecoveryKeysDto } from '@dto/login-generate-recovery-keys.dto';
import { RecoverAccountDto } from '@dto/recover-account.dto';
import { AccountRecoveredDto } from '@dto/account-recovered.dto';
import { WrongRecoveryKeysException } from '@exceptions/wrong-recovery-keys.exception';

export abstract class RecoveryDocs {
  static get RegGenRecoveryKeys() {
    const ApiModels = [
      RecoveryKeysResponseDto,
      GenerateRecoveryKeysDto,
      HashNotFoundException
    ];

    const apiOperationSum =
      'Endpoint is responsible for generating of recovery keys while registration.';
    const apiResponseDesc =
      'As a response function returns list of recovery keys.';
    const apiNotFoundDesc =
      'Not found exceptions are thrown in case if either hash not found.';
    const apiBodyDesc =
      'In order to generate the set of recovery keys user has to send passphrase that is going to be used in order to encrypt the set.';

    const confirmHashQuery = {
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
        schema: { $ref: getSchemaPath(RecoveryKeysResponseDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(HashNotFoundException) }
      },
      ApiBody: {
        type: GenerateRecoveryKeysDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(GenerateRecoveryKeysDto) }
      },
      ApiConfirmHashQuery: confirmHashQuery
    };
  }

  static get LoginGenRecKeys() {
    const ApiModels = [
      RecoveryKeysResponseDto,
      WrongCredentialsException,
      LoginGenerateRecoveryKeysDto
    ];

    const apiOperationSum =
      'Endpoint is responsible for generating of recovery keys while login, if keys were not generated while confirmation.';
    const apiResponseDesc =
      'As a response function returns list of recovery keys.';
    const apiBadRequestRespDesc =
      'Bad request error is thrown in case if user has provided wrong credentials.';
    const apiBodyDesc =
      'In order to generate the set of recovery keys user has to send passphrase that is going to be used in order to encrypt the set. Since it is a login, user also has to provide email and password.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(RecoveryKeysResponseDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(WrongCredentialsException) }
      },
      ApiBody: {
        type: LoginGenerateRecoveryKeysDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(LoginGenerateRecoveryKeysDto) }
      }
    };
  }

  static get GenerateRecoveryKeys() {
    const ApiModels = [GenerateRecoveryKeysDto, RecoveryKeysResponseDto];

    const apiOperationSum =
      'Endpoint is responsible for generating recovery keys.';
    const apiResponseDesc =
      'As a response function returns list of recovery keys.';
    const apiBodyDesc =
      'In the request body user has to provide only passphrase in order to encrypt and get fingerprint of set of recovery keys.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(RecoveryKeysResponseDto) }
      },
      ApiBody: {
        type: GenerateRecoveryKeysDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(GenerateRecoveryKeysDto) }
      }
    };
  }

  static get RecoveryAccount() {
    const ApiModels = [
      RecoverAccountDto,
      AccountRecoveredDto,
      WrongRecoveryKeysException
    ];

    const apiOperationSum = 'Endpoint is responsible for account recovery.';
    const apiResponseDesc =
      'As a response user gets the response that account has been successfully recovered. Meanwhile function resets MFA (both token and phone). While first login after reset user will have to set up new MFA and set of recovery keys.';
    const apiBadRequestRespDesc =
      'If there is recovery keys fingerprint mismatch, bad request will be thrown.';
    const apiBodyDesc =
      'In the body user provides recovery keys and passphrase for recovery keys.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(AccountRecoveredDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(WrongRecoveryKeysException) }
      },
      ApiBody: {
        type: RecoverAccountDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(RecoverAccountDto) }
      }
    };
  }
}
