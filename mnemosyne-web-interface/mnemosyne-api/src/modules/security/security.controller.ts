import { Body, Controller, Post, Query } from '@nestjs/common';
import { SecurityService } from '@modules/security/security.service';
import { VerifyTwoFaDto } from '@dto/verify-2fa.dto';
import { SendSmsCodeDto } from '@dto/send-sms-code.dto';
import { VerifyMobilePhoneDto } from '@dto/verify-mobile-phone.dto';
import { MfaByCredentialsDto } from '@dto/mfa-by-credentials.dto';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('generate-2fa-qr')
  generateTwoFaQrCode(
    @Query() { confirmationHash }: { confirmationHash: string },
    @Body() payload: MfaByCredentialsDto
  ) {
    return this.securityService.generate2FaQrCode({ confirmationHash });
  }

  @Post('verify-2fa')
  verifyTwoFaQrCode(
    @Body() payload: VerifyTwoFaDto,
    @Query() { confirmationHash }: { confirmationHash: string }
  ) {
    return this.securityService.verifyTwoFaQrCode({
      payload,
      confirmationHash
    });
  }

  @Post('send-sms-code')
  sendSmsCode(
    @Body() payload: SendSmsCodeDto,
    @Query() { confirmationHash }: { confirmationHash: string }
  ) {
    return this.securityService.sendSmsCode({
      payload,
      confirmationHash
    });
  }

  @Post('verify-mobile-phone')
  verifyMobilePhone(
    @Body() payload: VerifyMobilePhoneDto,
    @Query() { confirmationHash }: { confirmationHash: string }
  ) {
    return this.securityService.verifyMobilePhone({
      payload,
      confirmationHash
    });
  }
}
