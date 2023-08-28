import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { ConfirmEmailChangeDto } from '@dto/confirm-email-change.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { ResetUserPasswordDto } from '@dto/reset-user-password.dto';
import { Language } from '@interfaces/language.enum';
import { ConfirmCompanyAccDto } from '@dto/confirm-company-acc.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { ConfirmationHashDocs } from '@docs/confirmation-hash.docs';

@ApiTags('Confirmation Hashes')
@Controller('confirmation-hash')
export class ConfirmationHashController {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService
  ) {}

  @ApiOperation(ConfirmationHashDocs.AccountConfirmation.ApiOperation)
  @ApiExtraModels(...ConfirmationHashDocs.AccountConfirmation.ApiExtraModels)
  @ApiResponse(ConfirmationHashDocs.AccountConfirmation.ApiResponse)
  @ApiForbiddenResponse(
    ConfirmationHashDocs.AccountConfirmation.ApiForbiddenResponse
  )
  @ApiQuery(ConfirmationHashDocs.AccountConfirmation.ApiConfirmHashQuery)
  @ApiQuery(ConfirmationHashDocs.AccountConfirmation.ApiLangQuery)
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

  @ApiOperation(ConfirmationHashDocs.CompanyAccountConfirmation.ApiOperation)
  @ApiExtraModels(
    ...ConfirmationHashDocs.CompanyAccountConfirmation.ApiExtraModels
  )
  @ApiResponse(ConfirmationHashDocs.CompanyAccountConfirmation.ApiResponse)
  @ApiForbiddenResponse(
    ConfirmationHashDocs.CompanyAccountConfirmation.ApiForbiddenResponse
  )
  @ApiNotFoundResponse(
    ConfirmationHashDocs.CompanyAccountConfirmation.ApiNotFoundResponse
  )
  @ApiBody(ConfirmationHashDocs.CompanyAccountConfirmation.ApiBody)
  @ApiQuery(ConfirmationHashDocs.CompanyAccountConfirmation.ApiConfirmHashQuery)
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

  @ApiOperation(ConfirmationHashDocs.CompanyMemberAccConfirmation.ApiOperation)
  @ApiExtraModels(
    ...ConfirmationHashDocs.CompanyMemberAccConfirmation.ApiExtraModels
  )
  @ApiResponse(ConfirmationHashDocs.CompanyMemberAccConfirmation.ApiResponse)
  @ApiForbiddenResponse(
    ConfirmationHashDocs.CompanyMemberAccConfirmation.ApiForbiddenResponse
  )
  @ApiNotFoundResponse(
    ConfirmationHashDocs.CompanyMemberAccConfirmation.ApiNotFoundResponse
  )
  @ApiBody(ConfirmationHashDocs.CompanyMemberAccConfirmation.ApiBody)
  @ApiQuery(
    ConfirmationHashDocs.CompanyMemberAccConfirmation.ApiConfirmHashQuery
  )
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

  @ApiOperation(ConfirmationHashDocs.EmailChangeConfirmation.ApiOperation)
  @ApiExtraModels(
    ...ConfirmationHashDocs.EmailChangeConfirmation.ApiExtraModels
  )
  @ApiResponse(ConfirmationHashDocs.EmailChangeConfirmation.ApiResponse)
  @ApiBadRequestResponse(
    ConfirmationHashDocs.EmailChangeConfirmation.ApiBadRequestResponse
  )
  @ApiNotFoundResponse(
    ConfirmationHashDocs.EmailChangeConfirmation.ApiNotFoundResponse
  )
  @ApiBody(ConfirmationHashDocs.EmailChangeConfirmation.ApiBody)
  @ApiQuery(ConfirmationHashDocs.EmailChangeConfirmation.ApiConfirmHashQuery)
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

  @ApiOperation(ConfirmationHashDocs.ResetUserPasswordConfirmation.ApiOperation)
  @ApiExtraModels(
    ...ConfirmationHashDocs.ResetUserPasswordConfirmation.ApiExtraModels
  )
  @ApiResponse(ConfirmationHashDocs.ResetUserPasswordConfirmation.ApiResponse)
  @ApiBadRequestResponse(
    ConfirmationHashDocs.ResetUserPasswordConfirmation.ApiBadRequestResponse
  )
  @ApiNotFoundResponse(
    ConfirmationHashDocs.ResetUserPasswordConfirmation.ApiNotFoundResponse
  )
  @ApiBody(ConfirmationHashDocs.ResetUserPasswordConfirmation.ApiBody)
  @ApiQuery(
    ConfirmationHashDocs.ResetUserPasswordConfirmation.ApiConfirmHashQuery
  )
  @UsePipes(ValidationPipe)
  @Post('reset-user-password-confirmation')
  async resetUserPassword(
    @Query('confirmationHash') confirmationHash: string,
    @Body() payload: ResetUserPasswordDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.confirmationHashService.confirmResetUserPassword({
      hash: confirmationHash,
      payload,
      trx
    });
  }
}
