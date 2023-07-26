import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { SecurityService } from '@modules/security/security.service';
import { VerifyTwoFaDto } from '@dto/verify-two-fa.dto';
import { RegistrationSendSmsCodeDto } from '@dto/registration-send-sms-code.dto';
import { VerifyMobilePhoneDto } from '@dto/verify-mobile-phone.dto';
import { LoginSendSmsDto } from '@dto/login-send-sms.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { DeleteAccountDto } from '@dto/delete-account.dto';
import { DisableTwoFaDto } from '@dto/disable-two-fa.dto';
import { LoginGenerate2faQrDto } from '@dto/login-generate-2fa-qr.dto';

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
    @Body() payload: LoginGenerate2faQrDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.loginGenerateTwoFaQrCode({ payload, trx });
  }

  @UseGuards(AuthGuard)
  @Get('generate-2fa-qr')
  generateTwoFaQrCode(
    @UserId() userId: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.generateTwoFaQrCode({ userId, trx });
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

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('verify-2fa')
  verifyTwoFaQrCode(
    @Body() payload: VerifyTwoFaDto,
    @UserId() userId: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.verifyTwoFaQrCode({ payload, userId, trx });
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('disable-2fa')
  disableTwoFa(
    @Body() payload: DisableTwoFaDto,
    @UserId() userId: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.disableTwoFa({ payload, userId, trx });
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
    @Body() payload: LoginSendSmsDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.loginSendSmsCode({ payload, trx });
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Get('send-sms-code')
  sendSmsCode(
    @Body() payload: RegistrationSendSmsCodeDto,
    @UserId() userId: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.sendSmsCode({ payload, userId, trx });
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

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('verify-mobile-phone')
  verifyMobilePhone(
    @Body() payload: VerifyMobilePhoneDto,
    @UserId() userId: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.verifyMobilePhone({ payload, userId, trx });
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('disable-phone')
  disablePhone(
    @Body() payload: DisableTwoFaDto,
    @UserId() userId: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.disablePhone({ payload, userId, trx });
  }

  @UseGuards(AuthGuard)
  @Delete('delete-account')
  deleteUserAccount(
    @UserId() userId: string,
    @Body() payload: DeleteAccountDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.securityService.deleteUserAccount({
      userId,
      payload,
      trx
    });
  }
}
