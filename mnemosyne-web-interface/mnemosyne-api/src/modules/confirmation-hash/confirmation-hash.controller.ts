import { Controller, Get, Param } from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';

@Controller('confirmation-hash')
export class ConfirmationHashController {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService
  ) {}

  @Get('account-confirmation/:confirmationHash')
  confirmAccount(@Param('confirmationHash') confirmationHash: string) {
    return this.confirmationHashService.confirmAccount({ confirmationHash });
  }
}
