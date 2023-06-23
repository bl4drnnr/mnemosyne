import {
  Body,
  Controller,
  Post,
  Query,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { SecurityService } from '@modules/security/security.service';
import { VerifyTwoFaDto } from '@dto/verify-2fa.dto';
import { RegistrationSendSmsCodeDto } from '@dto/registration-send-sms-code.dto';
import { VerifyMobilePhoneDto } from '@dto/verify-mobile-phone.dto';
import { MfaByCredentialsDto } from '@dto/mfa-by-credentials.dto';
import { ResendLoginSmsDto } from '@dto/resend-login-sms.dto';
import { TransactionInterceptor } from '@interceptors/transaction.interceptor';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @UseInterceptors(TransactionInterceptor)
  @UsePipes(ValidationPipe)
  @Post('generate-2fa-qr')
  generateTwoFaQrCode(
    @Query() { confirmationHash }: { confirmationHash: string },
    @Body() payload: MfaByCredentialsDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.generate2FaQrCode({ confirmationHash, trx });
  }

  @UseInterceptors(TransactionInterceptor)
  @UsePipes(ValidationPipe)
  @Post('verify-2fa')
  verifyTwoFaQrCode(
    @Body() payload: VerifyTwoFaDto,
    @Query() { confirmationHash }: { confirmationHash: string },
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.verifyTwoFaQrCode({
      payload,
      confirmationHash,
      trx
    });
  }

  @UseInterceptors(TransactionInterceptor)
  @UsePipes(ValidationPipe)
  @Post('registration-send-sms-code')
  registrationSendSmsCode(
    @Body() payload: RegistrationSendSmsCodeDto,
    @Query() { confirmationHash }: { confirmationHash: string },
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.registrationSendSmsCode({
      payload,
      confirmationHash,
      trx
    });
  }

  @UseInterceptors(TransactionInterceptor)
  @UsePipes(ValidationPipe)
  @Post('resend-login-sms')
  resendLoginSms(
    @Body() payload: ResendLoginSmsDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.resendLoginSms({ payload, trx });
  }

  @UseInterceptors(TransactionInterceptor)
  @UsePipes(ValidationPipe)
  @Post('verify-mobile-phone')
  verifyMobilePhone(
    @Body() payload: VerifyMobilePhoneDto,
    @Query() { confirmationHash }: { confirmationHash: string },
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.verifyMobilePhone({
      payload,
      confirmationHash,
      trx
    });
  }
}
