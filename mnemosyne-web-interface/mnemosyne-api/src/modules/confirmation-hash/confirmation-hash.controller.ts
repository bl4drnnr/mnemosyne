import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { ConfirmEmailChangeDto } from '@dto/confirm-email-change.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { ResetUserPasswordDto } from '@dto/reset-user-password.dto';

@Controller('confirmation-hash')
export class ConfirmationHashController {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService
  ) {}

  @Get('account-confirmation')
  confirmAccount(
    @Query('confirmationHash') confirmationHash: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.confirmationHashService.confirmAccount({
      confirmationHash,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @Post('email-change-confirmation')
  confirmEmailChange(
    @Query('confirmationHash') confirmationHash: string,
    @Body() payload: ConfirmEmailChangeDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.confirmationHashService.confirmEmailChange({
      confirmationHash,
      payload,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @Post('reset-user-password-confirmation')
  async resetUserPassword(
    @Body() payload: ResetUserPasswordDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.confirmationHashService.confirmResetUserPassword({
      payload,
      trx
    });
  }
}
