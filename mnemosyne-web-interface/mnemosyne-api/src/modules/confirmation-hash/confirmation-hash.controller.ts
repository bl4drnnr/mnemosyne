import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { ConfirmEmailChangeDto } from '@dto/confirm-email-change.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { ResetUserPasswordDto } from '@dto/reset-user-password.dto';
import { Language } from '@interfaces/language.enum';
import { ConfirmCompanyAccDto } from '@dto/confirm-company-acc.dto';
import { ConfirmHashDocs } from '@docs/confirmation-hash.docs';

@ApiTags('Confirmation Hashes')
@Controller('confirmation-hash')
export class ConfirmationHashController {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService
  ) {}

  @ApiOperation(ConfirmHashDocs.AccConfirm.ApiOperation)
  @ApiExtraModels(...ConfirmHashDocs.AccConfirm.ApiExtraModels)
  @ApiResponse(ConfirmHashDocs.AccConfirm.ApiResponse)
  @ApiForbiddenResponse(ConfirmHashDocs.AccConfirm.ApiForbiddenResponse)
  @ApiQuery(ConfirmHashDocs.AccConfirm.ApiConfirmHashQuery)
  @ApiQuery(ConfirmHashDocs.AccConfirm.ApiLangQuery)
  @ApiBasicAuth('basicAuth')
  @Get('account-confirmation')
  confirmAccount(
    @TrxDecorator() trx: Transaction,
    @Query('confirmationHash') confirmationHash: string,
    @Query('language') language?: Language
  ) {
    return this.confirmationHashService.confirmAccount({
      confirmationHash,
      language,
      trx
    });
  }

  @ApiOperation(ConfirmHashDocs.CompanyAccConfirm.ApiOperation)
  @ApiExtraModels(...ConfirmHashDocs.CompanyAccConfirm.ApiExtraModels)
  @ApiResponse(ConfirmHashDocs.CompanyAccConfirm.ApiResponse)
  @ApiForbiddenResponse(ConfirmHashDocs.CompanyAccConfirm.ApiForbiddenResponse)
  @ApiNotFoundResponse(ConfirmHashDocs.CompanyAccConfirm.ApiNotFoundResponse)
  @ApiBody(ConfirmHashDocs.CompanyAccConfirm.ApiBody)
  @ApiQuery(ConfirmHashDocs.CompanyAccConfirm.ApiConfirmHashQuery)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('company-account-confirmation')
  confirmCompanyAccount(
    @TrxDecorator() trx: Transaction,
    @Body() payload: ConfirmCompanyAccDto,
    @Query('confirmationHash') confirmationHash: string
  ) {
    return this.confirmationHashService.confirmCompanyAccount({
      confirmationHash,
      payload,
      trx
    });
  }

  @ApiOperation(ConfirmHashDocs.CompanyMemberAccConfirm.ApiOperation)
  @ApiExtraModels(...ConfirmHashDocs.CompanyMemberAccConfirm.ApiExtraModels)
  @ApiResponse(ConfirmHashDocs.CompanyMemberAccConfirm.ApiResponse)
  @ApiForbiddenResponse(
    ConfirmHashDocs.CompanyMemberAccConfirm.ApiForbiddenResponse
  )
  @ApiNotFoundResponse(
    ConfirmHashDocs.CompanyMemberAccConfirm.ApiNotFoundResponse
  )
  @ApiBody(ConfirmHashDocs.CompanyMemberAccConfirm.ApiBody)
  @ApiQuery(ConfirmHashDocs.CompanyMemberAccConfirm.ApiConfirmHashQuery)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('company-member-account-confirmation')
  companyMemberAccountConfirmation(
    @TrxDecorator() trx: Transaction,
    @Body() payload: ConfirmCompanyAccDto,
    @Query('confirmationHash') confirmationHash: string
  ) {
    return this.confirmationHashService.companyMemberAccountConfirmation({
      confirmationHash,
      payload,
      trx
    });
  }

  @ApiOperation(ConfirmHashDocs.EmailChangeConfirm.ApiOperation)
  @ApiExtraModels(...ConfirmHashDocs.EmailChangeConfirm.ApiExtraModels)
  @ApiResponse(ConfirmHashDocs.EmailChangeConfirm.ApiResponse)
  @ApiBadRequestResponse(
    ConfirmHashDocs.EmailChangeConfirm.ApiBadRequestResponse
  )
  @ApiNotFoundResponse(ConfirmHashDocs.EmailChangeConfirm.ApiNotFoundResponse)
  @ApiBody(ConfirmHashDocs.EmailChangeConfirm.ApiBody)
  @ApiQuery(ConfirmHashDocs.EmailChangeConfirm.ApiConfirmHashQuery)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('email-change-confirmation')
  confirmEmailChange(
    @Query('confirmationHash') confirmationHash: string,
    @Body() payload: ConfirmEmailChangeDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.confirmationHashService.confirmEmailChange({
      confirmationHash,
      payload,
      trx
    });
  }

  @ApiOperation(ConfirmHashDocs.ResetUserPasswordConfirmation.ApiOperation)
  @ApiExtraModels(
    ...ConfirmHashDocs.ResetUserPasswordConfirmation.ApiExtraModels
  )
  @ApiResponse(ConfirmHashDocs.ResetUserPasswordConfirmation.ApiResponse)
  @ApiBadRequestResponse(
    ConfirmHashDocs.ResetUserPasswordConfirmation.ApiBadRequestResponse
  )
  @ApiNotFoundResponse(
    ConfirmHashDocs.ResetUserPasswordConfirmation.ApiNotFoundResponse
  )
  @ApiBody(ConfirmHashDocs.ResetUserPasswordConfirmation.ApiBody)
  @ApiQuery(ConfirmHashDocs.ResetUserPasswordConfirmation.ApiConfirmHashQuery)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('reset-user-password-confirmation')
  confirmResetUserPassword(
    @Query('confirmationHash') confirmationHash: string,
    @Body() payload: ResetUserPasswordDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.confirmationHashService.confirmResetUserPassword({
      hash: confirmationHash,
      payload,
      trx
    });
  }
}
