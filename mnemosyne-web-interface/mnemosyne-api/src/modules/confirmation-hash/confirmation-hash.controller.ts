import { Controller, Get, Query } from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';

@Controller('confirmation-hash')
export class ConfirmationHashController {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService
  ) {}

  @Get('account-confirmation')
  confirmAccount(@Query('confirmationHash') confirmationHash: string) {
    return this.confirmationHashService.confirmAccount({ confirmationHash });
  }
}
