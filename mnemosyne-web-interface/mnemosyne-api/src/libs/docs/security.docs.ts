import { getSchemaPath, refs } from '@nestjs/swagger';
import { QrCodeDto } from '@dto/qr-code.dto';
import { HashNotFoundException } from '@exceptions/hash-not-found.exception';
import { LoginGenerate2faQrDto } from '@dto/login-generate-2fa-qr.dto';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { VerifyTwoFaDto } from '@dto/verify-two-fa.dto';
import { MfaSetDto } from '@dto/mfa-set.dto';
import { WrongCodeException } from '@exceptions/wrong-code.exception';
import { DisableTwoFaDto } from '@dto/disable-two-fa.dto';
import { MfaDisabledDto } from '@dto/mfa-disabled.dto';
import { TwoFaNotSetException } from '@exceptions/two-fa-not-set.exception';
import { PhoneNotSetException } from '@exceptions/phone-not-set.exception';
import { RegistrationSendSmsCodeDto } from '@dto/registration-send-sms-code.dto';
import { SmsCodeSentDto } from '@dto/sms-code-sent.dto';
import { PhoneAlreadyTakenException } from '@exceptions/phone-already-taken.exception';
import { WrongTimeframeException } from '@exceptions/wrong-timeframe.exception';
import { LoginSendSmsDto } from '@dto/login-send-sms.dto';
import { Language } from '@interfaces/language.enum';
import { ApiBodyOptions } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { SmsClearedDto } from '@dto/sms-cleared.dto';
import { VerifyMobilePhoneDto } from '@dto/verify-mobile-phone.dto';
import { WrongProvidedPhoneException } from '@exceptions/wrong-provided-phone.exception';
import { SmsExpiredException } from '@exceptions/sms-expired.exception';
import { DeleteAccountDto } from '@dto/delete-account.dto';
import { FullMfaRequiredDto } from '@dto/full-mfa-required.dto';
import { TokenTwoFaRequiredDto } from '@dto/token-two-fa-required.dto';
import { DeleteConfirmationRequiredDto } from '@dto/delete-confirmation-required.dto';
import { PhoneMfaRequiredDto } from '@dto/phone-mfa-required.dto';
import { AccountDeletedDto } from '@dto/account-deleted.dto';
import { WrongDeletionConfirmationException } from '@exceptions/wrong-deletion-confirmation.exception';
import { ChangePasswordDto } from '@dto/change-password.dto';
import { PasswordChangedDto } from '@dto/password-changed.dto';
import { PasswordChangedException } from '@exceptions/password-changed.exception';
import { PreviousPasswordException } from '@exceptions/previous-password.exception';
import { EmailChangeEmailSentDto } from '@dto/email-change-email-sent.dto';
import { ChangeEmailDto } from '@dto/change-email.dto';
import { EmailAlreadyChangedException } from '@exceptions/email-already-changed.exception';
import { EmailAlreadyTakenException } from '@exceptions/email-already-taken.exception';

export abstract class SecurityDocs {
  static get RegGenTwoFaQrCode() {
    const ApiModels = [QrCodeDto, HashNotFoundException];

    const apiOperationSum =
      'Endpoint is responsible for generating of QR code and secret after registration from confirmation hash.';
    const apiNotFoundDesc =
      'Not found error is thrown in case if confirmation hash has not been found.';
    const apiResponseDesc =
      'As a response user gets link to the QR code to scan along with its secret that (only after successful confirmation) will be added to the database.';

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
        schema: { $ref: getSchemaPath(QrCodeDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(HashNotFoundException) }
      },
      ApiConfirmHashQuery: confirmHashQuery
    };
  }

  static get LoginGenTwoFaQrCode() {
    const ApiModels = [
      LoginGenerate2faQrDto,
      QrCodeDto,
      WrongCredentialsException
    ];

    const apiOperationSum =
      'Endpoint is responsible for generating of QR code and secret while login if it was not setup during account confirmation.';
    const apiBadRequestRespDesc =
      'Bad request is thrown in case if user provided wrong credentials.';
    const apiResponseDesc =
      'As a response user gets link to the QR code to scan along with its secret that (only after successful confirmation) will be added to the database.';
    const apiBodyDesc =
      'In the body user has to provide credentials - email and password.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(QrCodeDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(WrongCredentialsException) }
      },
      ApiBody: {
        type: LoginGenerate2faQrDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(LoginGenerate2faQrDto) }
      } as ApiBodyOptions
    };
  }

  static get GenerateTwoFaQrCode() {
    const ApiModels = [QrCodeDto];

    const apiOperationSum =
      'Endpoint is responsible for generating QR code and its secret only for authenticated users.';
    const apiResponseDesc =
      'As a response user gets link to the QR code to scan along with its secret that (only after successful confirmation) will be added to the database.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(QrCodeDto) }
      }
    };
  }

  static get RegVerifyTwoFa() {
    const ApiModels = [
      VerifyTwoFaDto,
      MfaSetDto,
      HashNotFoundException,
      WrongCodeException
    ];

    const apiOperationSum =
      'Endpoint is responsible 2FA verification while confirmation process after registration.';
    const apiResponseDesc =
      'As a response user gets message that 2FA is set and it is added to the database.';
    const apiNotFoundDesc =
      'Not found error is thrown in case if confirmation hash has not been found.';
    const apiBadRequestRespDesc =
      'Bad request is thrown in case if wrong code was provided.';
    const apiBodyDesc =
      'In this case body contains 2FA token that was generated on the BE and sent to user, and 6-digit code that verifies this token.';

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
        schema: { $ref: getSchemaPath(MfaSetDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(HashNotFoundException) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(WrongCodeException) }
      },
      ApiBody: {
        type: VerifyTwoFaDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(VerifyTwoFaDto) }
      } as ApiBodyOptions,
      ApiConfirmHashQuery: confirmHashQuery
    };
  }

  static get LoginVerifyTwoFa() {
    const ApiModels = [
      VerifyTwoFaDto,
      MfaSetDto,
      WrongCredentialsException,
      WrongCodeException
    ];
    const BadRequests = [WrongCredentialsException, WrongCodeException];

    const apiOperationSum =
      'Endpoint is responsible for 2FA verification while login process.';
    const apiResponseDesc =
      'As a response user gets message that 2FA is set and it is added to the database.';
    const apiBadRequestDesc =
      'Bad request error is throws in case if user provided either wrong credentials or, if credentials are correct, wrong code.';
    const apiBodyDesc =
      'In this case body contains 2FA token that was generated on the BE and sent to user, and 6-digit code that verifies this token along with email and password.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(MfaSetDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiBody: {
        type: VerifyTwoFaDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(VerifyTwoFaDto) }
      } as ApiBodyOptions
    };
  }

  static get VerifyTwoFa() {
    const ApiModels = [VerifyTwoFaDto, MfaSetDto, WrongCodeException];

    const apiOperationSum =
      'Endpoint is responsible for 2FA verification and available only for authenticated users.';
    const apiResponseDesc =
      'As a response user gets message that 2FA is set and it is added to the database.';
    const apiBadRequestDesc =
      'Bad request error is throws in case if user provided wrong code.';
    const apiBodyDesc =
      'In this case body contains 2FA token that was generated on the BE and sent to user, and 6-digit code that verifies this token.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(MfaSetDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestDesc,
        schema: { $ref: getSchemaPath(WrongCodeException) }
      },
      ApiBody: {
        type: VerifyTwoFaDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(VerifyTwoFaDto) }
      } as ApiBodyOptions
    };
  }

  static get DisableTwoFa() {
    const ApiModels = [
      DisableTwoFaDto,
      MfaDisabledDto,
      TwoFaNotSetException,
      PhoneNotSetException,
      WrongCodeException
    ];
    const BadRequests = [
      TwoFaNotSetException,
      PhoneNotSetException,
      WrongCodeException
    ];

    const apiOperationSum =
      'Endpoint is responsible for 2FA disable. Available only for authenticated users.';
    const apiResponseDesc =
      'As a response user gets message that 2FA is disabled.';
    const apiBadRequestDesc =
      'Bad requests are thrown in case if either 2FA or phone is not set or wrong code provided.';
    const apiBodyDesc = 'In the body user has to provide 6-digit code.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(MfaDisabledDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiBody: {
        type: DisableTwoFaDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(DisableTwoFaDto) }
      } as ApiBodyOptions
    };
  }

  static get RegSendSmsCode() {
    const ApiModels = [
      RegistrationSendSmsCodeDto,
      SmsCodeSentDto,
      PhoneAlreadyTakenException,
      WrongTimeframeException
    ];
    const BadRequests = [PhoneAlreadyTakenException, WrongTimeframeException];

    const apiOperationSum =
      'Endpoint is responsible for setting MFA (mobile phone) while confirmation after registration process.';
    const apiResponseDesc =
      'As a response user gets message that code is sent.';
    const apiBadRequestDesc =
      'Bad request error is thrown in case if mobile phone is already taken or user is trying to resent SMS message within wrong timeframe.';
    const apiBodyDesc = 'In the body user has to provide mobile phone.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(SmsCodeSentDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiBody: {
        type: RegistrationSendSmsCodeDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(RegistrationSendSmsCodeDto) }
      } as ApiBodyOptions
    };
  }

  static get LoginSendSmsCode() {
    const ApiModels = [
      LoginSendSmsDto,
      SmsCodeSentDto,
      WrongCredentialsException,
      WrongTimeframeException
    ];
    const BadRequests = [WrongCredentialsException, WrongTimeframeException];

    const apiOperationSum =
      'Endpoint is responsible for sending SMS code as MFA method while logging in.';
    const apiResponseDesc =
      'As a response user gets message that SMS has been sent.';
    const apiBadRequestResponse =
      'Bad requests error os thrown in case if user provided wrong credentials or tried to resent SMS message in wrong timeframe.';
    const apiBodyDesc = 'In the body user has to provide email and password.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(SmsCodeSentDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestResponse,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiBody: {
        type: LoginSendSmsDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(LoginSendSmsDto) }
      } as ApiBodyOptions
    };
  }

  static get SendSmsCode() {
    const ApiModels = [
      RegistrationSendSmsCodeDto,
      SmsCodeSentDto,
      WrongTimeframeException
    ];

    const apiOperationSum =
      'Endpoint is responsible for sending SMS code. Available only for authenticated users.';
    const apiResponseDesc =
      'As a response user gets message that SMS has been sent.';
    const apiBadRequestResponse =
      'Bad requests error os thrown in case if user tried to resent SMS message in wrong timeframe.';
    const apiBodyDesc = 'In the body user has to provide mobile phone.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(SmsCodeSentDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestResponse,
        schema: { $ref: getSchemaPath(WrongTimeframeException) }
      },
      ApiBody: {
        type: RegistrationSendSmsCodeDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(RegistrationSendSmsCodeDto) }
      } as ApiBodyOptions
    };
  }

  static get HashSendSmsCode() {
    const ApiModels = [
      SmsCodeSentDto,
      HashNotFoundException,
      WrongTimeframeException
    ];

    const apiOperationSum =
      'Endpoint is responsible for sending SMS code based on confirmation hash while email change confirmation or password reset.';
    const apiResponseDesc =
      'As a response user gets message that SMS has been sent.';
    const apiNotFoundDesc =
      'Not found error is thrown in case if confirmation hash has not been found.';
    const apiBadRequestRespDesc =
      'Bad request is thrown in case if code was sent in wrong timeframe.';

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
        schema: { $ref: getSchemaPath(SmsCodeSentDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(HashNotFoundException) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(WrongTimeframeException) }
      },
      ApiConfirmHashQuery: confirmHashQuery,
      ApiLangQuery: languageQuery
    };
  }

  static get GetSmsCode() {
    const ApiModels = [
      SmsCodeSentDto,
      PhoneNotSetException,
      WrongTimeframeException
    ];
    const BadRequests = [PhoneNotSetException, WrongTimeframeException];

    const apiOperationSum =
      'Endpoint is responsible for setting up phone for authenticated users.';
    const apiResponseDesc =
      'As a response user gets message that SMS has been sent.';
    const apiBadRequestRespDesc =
      'Bad request error is thrown in case if phone has not set up.';

    const langQueryDesc = 'Language that is going to be user in order to select the language of the email template, SMS message etc. Comes from FE localStorage from Transloco package.';

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
        schema: { $ref: getSchemaPath(SmsCodeSentDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiLangQuery: languageQuery
    };
  }

  static get ClearSmsCode() {
    const ApiModels = [SmsClearedDto, PhoneNotSetException];

    const apiOperationSum = 'Endpoint is responsible for clearing SMS code.';
    const apiResponseDesc =
      'As a response user gets message that SMS is cleared.';
    const apiBadRequestRespDesc =
      'Bad request error is thrown in case if phone has not set up.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(SmsClearedDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(PhoneNotSetException) }
      }
    };
  }

  static get RegVerifyMobilePhone() {
    const ApiModels = [
      VerifyMobilePhoneDto,
      MfaSetDto,
      HashNotFoundException,
      WrongProvidedPhoneException,
      WrongCodeException,
      SmsExpiredException
    ];
    const BadRequests = [
      WrongProvidedPhoneException,
      WrongCodeException,
      SmsExpiredException
    ];

    const apiOperationSum =
      'Endpoint is responsible for verification of mobile phone number while confirmation process after registration.';
    const apiResponseDesc = 'As a response user gets message that MFA is set.';
    const apiBadRequestRespDesc =
      'Bad request error is thrown in case if user provided wrong phone (was modified artificially), or wrong code, or SMS code expired.';
    const apiNotFoundDesc =
      'Not found error is thrown in case if confirmation hash not found.';
    const apiBodyDesc =
      'Body contains mobile phone number along with associated with it code.';

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
        schema: { $ref: getSchemaPath(MfaSetDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(HashNotFoundException) }
      },
      ApiBody: {
        type: VerifyMobilePhoneDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(VerifyMobilePhoneDto) }
      } as ApiBodyOptions,
      ApiConfirmHashQuery: confirmHashQuery
    };
  }

  static get LoginVerifyMobilePhone() {
    const ApiModels = [
      VerifyMobilePhoneDto,
      MfaSetDto,
      WrongCredentialsException,
      WrongProvidedPhoneException,
      WrongCodeException,
      SmsExpiredException
    ];
    const BadRequests = [
      WrongCredentialsException,
      WrongProvidedPhoneException,
      WrongCodeException,
      SmsExpiredException
    ];

    const apiOperationSum =
      'Endpoint is responsible for verification of mobile phone number during login.';
    const apiResponseDesc = 'As a response user gets message that MFA is set.';
    const apiBadRequestRespDesc =
      'Bad request is thrown in following cases: wrong credentials, wrong (modified artificially) provided phone number, wrong code, SMS expired.';
    const apiBodyDesc =
      'Body contains mobile phone number along with associated with it code. Because of the fact that this is login, user also has to provide email and password.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(MfaSetDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiBody: {
        type: VerifyMobilePhoneDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(VerifyMobilePhoneDto) }
      } as ApiBodyOptions
    };
  }

  static get VerifyMobilePhone() {
    const ApiModels = [
      VerifyMobilePhoneDto,
      MfaSetDto,
      WrongProvidedPhoneException,
      WrongCodeException,
      SmsExpiredException
    ];
    const BadRequests = [
      WrongProvidedPhoneException,
      WrongCodeException,
      SmsExpiredException
    ];

    const apiOperationSum =
      'Endpoint is responsible for mobile phone verification. Available only for authenticated users.';
    const apiResponseDesc = 'As a response user gets message that MFA is set.';
    const apiBadRequestRespDesc =
      'Bad request is thrown in following cases: wrong (modified artificially) provided phone number, wrong code, SMS expired.';
    const apiBodyDesc =
      'Body contains mobile phone number along with associated with it code.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(MfaSetDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiBody: {
        type: VerifyMobilePhoneDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(VerifyMobilePhoneDto) }
      } as ApiBodyOptions
    };
  }

  static get DisablePhone() {
    const ApiModels = [
      DisableTwoFaDto,
      MfaDisabledDto,
      PhoneNotSetException,
      TwoFaNotSetException,
      WrongProvidedPhoneException,
      WrongCodeException,
      SmsExpiredException
    ];
    const BadRequests = [
      PhoneNotSetException,
      TwoFaNotSetException,
      WrongProvidedPhoneException,
      WrongCodeException,
      SmsExpiredException
    ];

    const apiOperationSum = 'Endpoint is responsible for token MFA disable.';
    const apiResponseDesc =
      'As a response user gets message that token MFA is disabled.';
    const apiBadRequestRespDesc =
      'Bad request error is thrown in following cases: phone not set, token 2FA not set (either one of them), wrong phone, wrong code or SMS expired.';
    const apiBodyDesc = 'Body contains 6-digit code to verify token.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(MfaDisabledDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiBody: {
        type: DisableTwoFaDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(DisableTwoFaDto) }
      } as ApiBodyOptions
    };
  }

  static get DeleteAccount() {
    const ApiModels = [
      DeleteAccountDto,
      AccountDeletedDto,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto,
      DeleteConfirmationRequiredDto,
      WrongCredentialsException,
      WrongDeletionConfirmationException,
      WrongCodeException
    ];
    const BadRequests = [
      WrongCredentialsException,
      WrongDeletionConfirmationException,
      WrongCodeException
    ];
    const ApiResponses = [
      AccountDeletedDto,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto,
      DeleteConfirmationRequiredDto
    ];

    const apiOperationSum = 'Endpoint is responsible for account deletion.';
    const apiResponseDesc =
      'Responses include following: MFA required, deletion confirmation required, or account deleted.';
    const apiBadRequestRespDesc =
      'Bad request is thrown in following cases: wrong credentials, wrong deletion confirmation, or wrong MFA code';
    const apiBodyDesc =
      'Body includes credentials, MFA code(s), and full name as deletion confirmation.';

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
        type: DeleteAccountDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(DeleteAccountDto) }
      } as ApiBodyOptions
    };
  }

  static get ChangePassword() {
    const ApiModels = [
      ChangePasswordDto,
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto,
      PasswordChangedDto,
      PasswordChangedException,
      WrongCredentialsException,
      PreviousPasswordException,
      SmsExpiredException,
      WrongCodeException
    ];
    const BadRequests = [
      PasswordChangedException,
      WrongCredentialsException,
      PreviousPasswordException,
      WrongCodeException,
      SmsExpiredException
    ];
    const ApiResponses = [
      FullMfaRequiredDto,
      TokenTwoFaRequiredDto,
      PhoneMfaRequiredDto,
      PasswordChangedDto
    ];

    const apiOperationSum = 'Endpoint is responsible for password change.';
    const apiResponseDesc =
      'Responses include following: MFA required or password changed.';
    const apiBadRequestRespDesc =
      'Bad request is thrown in following cases: wrong credentials, wrong MFA code, SMS expired, or password was change (wrong timeframe) or previous password is used.';
    const apiBodyDesc =
      'Body contains current password, new password, MFA code(s).';

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
        type: ChangePasswordDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(ChangePasswordDto) }
      } as ApiBodyOptions
    };
  }

  static get ChangeEmail() {
    const ApiModels = [
      ChangeEmailDto,
      EmailChangeEmailSentDto,
      EmailAlreadyChangedException,
      EmailAlreadyTakenException
    ];

    const apiOperationSum = 'Endpoint is responsible for email change.';
    const apiResponseDesc =
      'As a response user gets the message that confirmation email for email change has been sent.';
    const apiBadRequestRespDesc =
      'Bad request error is thrown in case if email is already taken.';
    const apiForbiddenRespDesc =
      'Forbidden error is thrown in case if email is already changed.';
    const apiBodyDesc = 'User has to provide new email.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(EmailChangeEmailSentDto) }
      },
      ApiForbiddenResponse: {
        description: apiForbiddenRespDesc,
        schema: { $ref: getSchemaPath(EmailAlreadyChangedException) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(EmailAlreadyTakenException) }
      },
      ApiBody: {
        type: ChangeEmailDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(ChangeEmailDto) }
      } as ApiBodyOptions
    };
  }
}
