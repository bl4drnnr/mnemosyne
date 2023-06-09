import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { SecurityService } from '@modules/security/security.service';
import { VerifyTwoFaDto } from '@dto/verify-2fa.dto';
import { RegistrationSendSmsCodeDto } from '@dto/registration-send-sms-code.dto';
import { VerifyMobilePhoneDto } from '@dto/verify-mobile-phone.dto';
import { MfaLoginDto } from '@dto/mfa-login.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('registration-generate-2fa-qr')
  registrationGenerateTwoFaQrCode(
    @Query() { confirmationHash }: { confirmationHash: string },
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.registrationGenerateTwoFaQrCode({
      confirmationHash,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @Post('login-generate-2fa-qr')
  loginGenerateTwoFaQrCode(
    @Body() payload: MfaLoginDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.loginGenerateTwoFaQrCode({ payload, trx });
  }

  @UsePipes(ValidationPipe)
  @Post('registration-verify-2fa')
  registrationVerifyTwoFaQrCode(
    @Body() payload: VerifyTwoFaDto,
    @Query() { confirmationHash }: { confirmationHash: string },
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.registrationVerifyTwoFaQrCode({
      payload,
      confirmationHash,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @Post('login-verify-2fa')
  loginVerifyTwoFaQrCode(
    @Body() payload: VerifyTwoFaDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.loginVerifyTwoFaQrCode({ payload, trx });
  }

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

  @UsePipes(ValidationPipe)
  @Post('login-send-sms-code')
  loginSendSmsCode(
    @Body() payload: MfaLoginDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.loginSendSmsCode({ payload, trx });
  }

  @UsePipes(ValidationPipe)
  @Post('registration-verify-mobile-phone')
  registrationVerifyMobilePhone(
    @Body() payload: VerifyMobilePhoneDto,
    @Query() { confirmationHash }: { confirmationHash: string },
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.registrationVerifyMobilePhone({
      payload,
      confirmationHash,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @Post('login-verify-mobile-phone')
  loginVerifyMobilePhone(
    @Body() payload: VerifyMobilePhoneDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.loginVerifyMobilePhone({
      payload,
      trx
    });
  }
}
