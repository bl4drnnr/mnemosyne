import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SecurityService } from '@modules/security/security.service';
import { VerifyTwoFaDto } from '@dto/verify-2fa.dto';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('generate-2fa-qr')
  generateTwoFaQrCode(
    @Query() { confirmationHash }: { confirmationHash: string }
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
  sendSmsCode() {
    return this.securityService.sendSmsCode();
  }

  @Post('verify-mobile-phone')
  verifyMobilePhone() {
    return this.securityService.verifyMobilePhone();
  }
}
