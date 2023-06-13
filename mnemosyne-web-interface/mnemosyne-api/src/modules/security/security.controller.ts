import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SecurityService } from '@modules/security/security.service';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('generate-2fa-qr')
  generateTwoFaQrCode(
    @Body() { confirmationHash }: { confirmationHash: string }
  ) {
    return this.securityService.generate2FaQrCode({ confirmationHash });
  }

  @Post('verify-2fa')
  verifyTwoFaQrCode(@Body() payload: any) {
    return this.securityService.verifyTwoFaQrCode(payload);
  }
}
