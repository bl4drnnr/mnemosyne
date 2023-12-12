import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { SecurityService } from '@modules/security/security.service';
import { VerifyTwoFaDto } from '@dto/verify-two-fa.dto';
import { RegistrationSendSmsCodeDto } from '@dto/registration-send-sms-code.dto';
import { VerifyMobilePhoneDto } from '@dto/verify-mobile-phone.dto';
import { LoginSendSmsDto } from '@dto/login-send-sms.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { DeleteAccountDto } from '@dto/delete-account.dto';
import { DisableTwoFaDto } from '@dto/disable-two-fa.dto';
import { LoginGenerate2faQrDto } from '@dto/login-generate-2fa-qr.dto';
import { ChangePasswordDto } from '@dto/change-password.dto';
import { ChangeEmailDto } from '@dto/change-email.dto';
import { Language } from '@interfaces/language.enum';
import { SecurityDocs } from '@docs/security.docs';

@ApiTags('Security')
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @ApiOperation(SecurityDocs.RegGenTwoFaQrCode.ApiOperation)
  @ApiExtraModels(...SecurityDocs.RegGenTwoFaQrCode.ApiExtraModels)
  @ApiResponse(SecurityDocs.RegGenTwoFaQrCode.ApiResponse)
  @ApiNotFoundResponse(SecurityDocs.RegGenTwoFaQrCode.ApiNotFoundResponse)
  @ApiQuery(SecurityDocs.RegGenTwoFaQrCode.ApiConfirmHashQuery)
  @ApiBasicAuth('basicAuth')
  @Get('registration-generate-2fa-qr')
  registrationGenerateTwoFaQrCode(
    @Query('confirmationHash') confirmationHash: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.registrationGenerateTwoFaQrCode({
      confirmationHash,
      trx
    });
  }

  @ApiOperation(SecurityDocs.LoginGenTwoFaQrCode.ApiOperation)
  @ApiExtraModels(...SecurityDocs.LoginGenTwoFaQrCode.ApiExtraModels)
  @ApiResponse(SecurityDocs.LoginGenTwoFaQrCode.ApiResponse)
  @ApiBadRequestResponse(SecurityDocs.LoginGenTwoFaQrCode.ApiBadRequestResponse)
  @ApiBody(SecurityDocs.LoginGenTwoFaQrCode.ApiBody)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('login-generate-2fa-qr')
  loginGenerateTwoFaQrCode(
    @Body() payload: LoginGenerate2faQrDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.loginGenerateTwoFaQrCode({ payload, trx });
  }

  @ApiOperation(SecurityDocs.GenerateTwoFaQrCode.ApiOperation)
  @ApiExtraModels(...SecurityDocs.GenerateTwoFaQrCode.ApiExtraModels)
  @ApiResponse(SecurityDocs.GenerateTwoFaQrCode.ApiResponse)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('generate-2fa-qr')
  generateTwoFaQrCode(
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.generateTwoFaQrCode({ userId, trx });
  }

  @ApiOperation(SecurityDocs.RegVerifyTwoFa.ApiOperation)
  @ApiExtraModels(...SecurityDocs.RegVerifyTwoFa.ApiExtraModels)
  @ApiResponse(SecurityDocs.RegVerifyTwoFa.ApiResponse)
  @ApiNotFoundResponse(SecurityDocs.RegVerifyTwoFa.ApiNotFoundResponse)
  @ApiBadRequestResponse(SecurityDocs.RegVerifyTwoFa.ApiBadRequestResponse)
  @ApiBody(SecurityDocs.RegVerifyTwoFa.ApiBody)
  @ApiQuery(SecurityDocs.RegVerifyTwoFa.ApiConfirmHashQuery)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('registration-verify-2fa')
  registrationVerifyTwoFaQrCode(
    @Body() payload: VerifyTwoFaDto,
    @Query('confirmationHash') confirmationHash: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.registrationVerifyTwoFaQrCode({
      payload,
      confirmationHash,
      trx
    });
  }

  @ApiOperation(SecurityDocs.LoginVerifyTwoFa.ApiOperation)
  @ApiExtraModels(...SecurityDocs.LoginVerifyTwoFa.ApiExtraModels)
  @ApiResponse(SecurityDocs.LoginVerifyTwoFa.ApiResponse)
  @ApiBadRequestResponse(SecurityDocs.LoginVerifyTwoFa.ApiBadRequestResponse)
  @ApiBody(SecurityDocs.LoginVerifyTwoFa.ApiBody)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('login-verify-2fa')
  loginVerifyTwoFaQrCode(
    @Body() payload: VerifyTwoFaDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.loginVerifyTwoFaQrCode({ payload, trx });
  }

  @ApiOperation(SecurityDocs.VerifyTwoFa.ApiOperation)
  @ApiExtraModels(...SecurityDocs.VerifyTwoFa.ApiExtraModels)
  @ApiResponse(SecurityDocs.VerifyTwoFa.ApiResponse)
  @ApiBadRequestResponse(SecurityDocs.VerifyTwoFa.ApiBadRequestResponse)
  @ApiBody(SecurityDocs.VerifyTwoFa.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('verify-2fa')
  verifyTwoFaQrCode(
    @Body() payload: VerifyTwoFaDto,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.verifyTwoFaQrCode({ payload, userId, trx });
  }

  @ApiOperation(SecurityDocs.DisableTwoFa.ApiOperation)
  @ApiExtraModels(...SecurityDocs.DisableTwoFa.ApiExtraModels)
  @ApiResponse(SecurityDocs.DisableTwoFa.ApiResponse)
  @ApiBadRequestResponse(SecurityDocs.DisableTwoFa.ApiBadRequestResponse)
  @ApiBody(SecurityDocs.DisableTwoFa.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('disable-2fa')
  disableTwoFa(
    @Body() payload: DisableTwoFaDto,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.disableTwoFa({ payload, userId, trx });
  }

  @ApiOperation(SecurityDocs.RegSendSmsCode.ApiOperation)
  @ApiExtraModels(...SecurityDocs.RegSendSmsCode.ApiExtraModels)
  @ApiResponse(SecurityDocs.RegSendSmsCode.ApiResponse)
  @ApiBadRequestResponse(SecurityDocs.RegSendSmsCode.ApiBadRequestResponse)
  @ApiBody(SecurityDocs.RegSendSmsCode.ApiBody)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('registration-send-sms-code')
  registrationSendSmsCode(
    @Body() payload: RegistrationSendSmsCodeDto,
    @Query('confirmationHash') confirmationHash: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.registrationSendSmsCode({
      payload,
      confirmationHash,
      trx
    });
  }

  @ApiOperation(SecurityDocs.LoginSendSmsCode.ApiOperation)
  @ApiExtraModels(...SecurityDocs.LoginSendSmsCode.ApiExtraModels)
  @ApiResponse(SecurityDocs.LoginSendSmsCode.ApiResponse)
  @ApiBadRequestResponse(SecurityDocs.LoginSendSmsCode.ApiBadRequestResponse)
  @ApiBody(SecurityDocs.LoginSendSmsCode.ApiBody)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('login-send-sms-code')
  loginSendSmsCode(
    @Body() payload: LoginSendSmsDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.loginSendSmsCode({ payload, trx });
  }

  @ApiOperation(SecurityDocs.SendSmsCode.ApiOperation)
  @ApiExtraModels(...SecurityDocs.SendSmsCode.ApiExtraModels)
  @ApiResponse(SecurityDocs.SendSmsCode.ApiResponse)
  @ApiBadRequestResponse(SecurityDocs.SendSmsCode.ApiBadRequestResponse)
  @ApiBody(SecurityDocs.SendSmsCode.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('send-sms-code')
  sendSmsCode(
    @Body() payload: RegistrationSendSmsCodeDto,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.sendSmsCode({ payload, userId, trx });
  }

  @ApiOperation(SecurityDocs.HashSendSmsCode.ApiOperation)
  @ApiExtraModels(...SecurityDocs.HashSendSmsCode.ApiExtraModels)
  @ApiResponse(SecurityDocs.HashSendSmsCode.ApiResponse)
  @ApiNotFoundResponse(SecurityDocs.HashSendSmsCode.ApiNotFoundResponse)
  @ApiBadRequestResponse(SecurityDocs.HashSendSmsCode.ApiBadRequestResponse)
  @ApiQuery(SecurityDocs.HashSendSmsCode.ApiConfirmHashQuery)
  @ApiQuery(SecurityDocs.HashSendSmsCode.ApiLangQuery)
  @ApiBasicAuth('basicAuth')
  @Get('hash-send-sms-code')
  hashSendSmsCode(
    @TrxDecorator() trx: Transaction,
    @Query('confirmationHash') confirmationHash: string,
    @Query('language') language?: Language
  ) {
    return this.securityService.hashSendSmsCode({
      confirmationHash,
      language,
      trx
    });
  }

  @ApiOperation(SecurityDocs.GetSmsCode.ApiOperation)
  @ApiExtraModels(...SecurityDocs.GetSmsCode.ApiExtraModels)
  @ApiResponse(SecurityDocs.GetSmsCode.ApiResponse)
  @ApiBadRequestResponse(SecurityDocs.GetSmsCode.ApiBadRequestResponse)
  @ApiQuery(SecurityDocs.GetSmsCode.ApiLangQuery)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('get-sms-code')
  getSmsCode(
    @Query('language') language: Language,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.getSmsCode({ userId, language, trx });
  }

  @ApiOperation(SecurityDocs.ClearSmsCode.ApiOperation)
  @ApiExtraModels(...SecurityDocs.ClearSmsCode.ApiExtraModels)
  @ApiResponse(SecurityDocs.ClearSmsCode.ApiResponse)
  @ApiBadRequestResponse(SecurityDocs.ClearSmsCode.ApiBadRequestResponse)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Post('clear-sms-code')
  clearSmsCode(@UserId() userId: string, @TrxDecorator() trx: Transaction) {
    return this.securityService.clearSmsCode({ userId, trx });
  }

  @ApiOperation(SecurityDocs.RegVerifyMobilePhone.ApiOperation)
  @ApiExtraModels(...SecurityDocs.RegVerifyMobilePhone.ApiExtraModels)
  @ApiResponse(SecurityDocs.RegVerifyMobilePhone.ApiResponse)
  @ApiBadRequestResponse(
    SecurityDocs.RegVerifyMobilePhone.ApiBadRequestResponse
  )
  @ApiNotFoundResponse(SecurityDocs.RegVerifyMobilePhone.ApiNotFoundResponse)
  @ApiBody(SecurityDocs.RegVerifyMobilePhone.ApiBody)
  @ApiQuery(SecurityDocs.RegVerifyMobilePhone.ApiConfirmHashQuery)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('registration-verify-mobile-phone')
  registrationVerifyMobilePhone(
    @Body() payload: VerifyMobilePhoneDto,
    @Query('confirmationHash') confirmationHash: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.registrationVerifyMobilePhone({
      payload,
      confirmationHash,
      trx
    });
  }

  @ApiOperation(SecurityDocs.LoginVerifyMobilePhone.ApiOperation)
  @ApiExtraModels(...SecurityDocs.LoginVerifyMobilePhone.ApiExtraModels)
  @ApiResponse(SecurityDocs.LoginVerifyMobilePhone.ApiResponse)
  @ApiBadRequestResponse(
    SecurityDocs.LoginVerifyMobilePhone.ApiBadRequestResponse
  )
  @ApiBody(SecurityDocs.LoginVerifyMobilePhone.ApiBody)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('login-verify-mobile-phone')
  loginVerifyMobilePhone(
    @Body() payload: VerifyMobilePhoneDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.loginVerifyMobilePhone({
      payload,
      trx
    });
  }

  @ApiOperation(SecurityDocs.VerifyMobilePhone.ApiOperation)
  @ApiExtraModels(...SecurityDocs.VerifyMobilePhone.ApiExtraModels)
  @ApiResponse(SecurityDocs.VerifyMobilePhone.ApiResponse)
  @ApiBadRequestResponse(SecurityDocs.VerifyMobilePhone.ApiBadRequestResponse)
  @ApiBody(SecurityDocs.VerifyMobilePhone.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('verify-mobile-phone')
  verifyMobilePhone(
    @Body() payload: VerifyMobilePhoneDto,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.verifyMobilePhone({ payload, userId, trx });
  }

  @ApiOperation(SecurityDocs.DisablePhone.ApiOperation)
  @ApiExtraModels(...SecurityDocs.DisablePhone.ApiExtraModels)
  @ApiResponse(SecurityDocs.DisablePhone.ApiResponse)
  @ApiBadRequestResponse(SecurityDocs.DisablePhone.ApiBadRequestResponse)
  @ApiBody(SecurityDocs.DisablePhone.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('disable-phone')
  disablePhone(
    @Body() payload: DisableTwoFaDto,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.disablePhone({ payload, userId, trx });
  }

  @ApiOperation(SecurityDocs.DeleteAccount.ApiOperation)
  @ApiExtraModels(...SecurityDocs.DeleteAccount.ApiExtraModels)
  @ApiResponse(SecurityDocs.DeleteAccount.ApiResponse)
  @ApiBadRequestResponse(SecurityDocs.DeleteAccount.ApiBadRequestResponse)
  @ApiBody(SecurityDocs.DeleteAccount.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Delete('delete-account')
  deleteUserAccount(
    @UserId() userId: string,
    @Body() payload: DeleteAccountDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.deleteUserAccount({
      userId,
      payload,
      trx
    });
  }

  @ApiOperation(SecurityDocs.ChangePassword.ApiOperation)
  @ApiExtraModels(...SecurityDocs.ChangePassword.ApiExtraModels)
  @ApiResponse(SecurityDocs.ChangePassword.ApiResponse)
  @ApiBadRequestResponse(SecurityDocs.ChangePassword.ApiBadRequestResponse)
  @ApiBody(SecurityDocs.ChangePassword.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('change-password')
  changePassword(
    @UserId() userId: string,
    @Body() payload: ChangePasswordDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.changePassword({
      userId,
      payload,
      trx
    });
  }

  @ApiOperation(SecurityDocs.ChangeEmail.ApiOperation)
  @ApiExtraModels(...SecurityDocs.ChangeEmail.ApiExtraModels)
  @ApiResponse(SecurityDocs.ChangeEmail.ApiResponse)
  @ApiForbiddenResponse(SecurityDocs.ChangeEmail.ApiForbiddenResponse)
  @ApiBadRequestResponse(SecurityDocs.ChangeEmail.ApiBadRequestResponse)
  @ApiBody(SecurityDocs.ChangeEmail.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('change-email')
  changeEmail(
    @UserId() userId: string,
    @Body() payload: ChangeEmailDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.securityService.changeEmail({
      userId,
      payload,
      trx
    });
  }
}
