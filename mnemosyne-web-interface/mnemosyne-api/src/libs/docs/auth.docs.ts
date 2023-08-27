import { LogInUserDto, LogInUserResponseDto } from '@dto/log-in-user.dto';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';
import { RecoveryKeysNotSetDto } from '@dto/recovery-keys-not-set.dto';
import { FullMfaRequiredDto } from '@dto/full-mfa-required.dto';
import { TokenTwoFaRequiredDto } from '@dto/token-two-fa-required.dto';
import { PhoneMfaRequiredDto } from '@dto/phone-mfa-required.dto';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { AccountNotConfirmedException } from '@exceptions/account-not-confirmed.exception';

export abstract class AuthDocs {
  static get LoginDocs() {
    return {
      OperationDesc: 'Endpoint is responsible for user login',
      ResponseDesc: 'As a response function gets 2 tokens - refresh and access',
      BodyType: LogInUserDto,
      BodyTypeDesc:
        'According to the requirements, all users will have to configure MFA for their accounts. Therefore, even tho both MFA codes are optional, at least one of them will be provided',
      Responses: [
        LogInUserResponseDto,
        MfaNotSetDto,
        RecoveryKeysNotSetDto,
        FullMfaRequiredDto,
        TokenTwoFaRequiredDto,
        PhoneMfaRequiredDto,
        WrongCredentialsException,
        AccountNotConfirmedException
      ]
    };
  }
}
