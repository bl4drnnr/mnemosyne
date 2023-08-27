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

export abstract class AuthDocs {
  static get Login() {
    return {
      OperationDesc: 'Endpoint is responsible for user login',
      BodyType: LogInUserDto,
      BodyTypeDesc:
        'According to the requirements, all users will have to configure MFA for their accounts. Therefore, even tho both MFA codes are optional, at least one of them will be provided',
      ResponseDesc:
        'As a response function gets 2 tokens - refresh and access. Also, as a response user may get a message that either token or phone MFA is required or both of them. It is sent as a message (status 201), not an error.',
      Responses: [
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
      ],
      BadRequestDesc:
        'Bad request responses include wrong provided MFA code, or expired MFA code, or wrong provided credentials.',
      BadRequests: [
        SmsExpiredException,
        WrongCredentialsException,
        WrongCodeException
      ],
      ForbiddenDesc:
        'Forbidden response for login includes only response saying that user account has not been confirmed. It means, that it exists, but user have not clicked the link in the message.',
      Forbidden: [AccountNotConfirmedException]
    };
  }
}
