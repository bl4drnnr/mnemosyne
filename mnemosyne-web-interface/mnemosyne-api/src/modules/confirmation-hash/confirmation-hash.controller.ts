import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { ConfirmEmailChangeDto } from '@dto/confirm-email-change.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { ResetUserPasswordDto } from '@dto/reset-user-password.dto';
import { Language } from '@interfaces/language.enum';
import { ConfirmCompanyAccDto } from '@dto/confirm-company-acc.dto';

@Controller('confirmation-hash')
export class ConfirmationHashController {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService
  ) {}

  @Get('account-confirmation')
  confirmAccount(
    @TransactionParam() trx: Transaction,
    @Query('confirmationHash') confirmationHash: string,
    @Query('language') language?: Language
  ) {
    return this.confirmationHashService.confirmAccount({
      confirmationHash,
      language,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @Post('company-account-confirmation')
  confirmCompanyAccount(
    @TransactionParam() trx: Transaction,
    @Body() payload: ConfirmCompanyAccDto,
    @Query('confirmationHash') confirmationHash: string
  ) {
    return this.confirmationHashService.confirmCompanyAccount({
      confirmationHash,
      payload,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @Post('company-member-account-confirmation')
  companyMemberAccountConfirmation(
    @TransactionParam() trx: Transaction,
    @Body() payload: ConfirmCompanyAccDto,
    @Query('confirmationHash') confirmationHash: string
  ) {
    return this.confirmationHashService.companyMemberAccountConfirmation({
      confirmationHash,
      payload,
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
