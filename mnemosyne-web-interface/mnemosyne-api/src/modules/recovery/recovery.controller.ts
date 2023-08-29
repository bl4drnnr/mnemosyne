import {
  Body,
  Controller,
  Post,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { ValidationPipe } from '@pipes/validation.pipe';
import { GenerateRecoveryKeysDto } from '@dto/generate-recovery-keys.dto';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { RecoverAccountDto } from '@dto/recover-account.dto';
import { RecoveryService } from '@modules/recovery.service';
import { LoginGenerateRecoveryKeysDto } from '@dto/login-generate-recovery-keys.dto';
import { RecoveryDocs } from '@docs/recovery.docs';

@ApiTags('Recovery')
@Controller('recovery')
export class RecoveryController {
  constructor(private readonly recoveryService: RecoveryService) {}

  @ApiOperation(RecoveryDocs.RegGenRecoveryKeys.ApiOperation)
  @ApiExtraModels(...RecoveryDocs.RegGenRecoveryKeys.ApiExtraModels)
  @ApiResponse(RecoveryDocs.RegGenRecoveryKeys.ApiResponse)
  @ApiNotFoundResponse(RecoveryDocs.RegGenRecoveryKeys.ApiNotFoundResponse)
  @ApiBody(RecoveryDocs.RegGenRecoveryKeys.ApiBody)
  @ApiQuery(RecoveryDocs.RegGenRecoveryKeys.ApiConfirmHashQuery)
  @UsePipes(ValidationPipe)
  @Post('registration-generate-recovery-keys')
  registrationGenerateRecoveryKeys(
    @Query('confirmationHash') confirmationHash: string,
    @Body() payload: GenerateRecoveryKeysDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.recoveryService.registrationGenerateRecoveryKeys({
      confirmationHash,
      payload,
      trx
    });
  }

  @ApiOperation(RecoveryDocs.LoginGenRecKeys.ApiOperation)
  @ApiExtraModels(...RecoveryDocs.LoginGenRecKeys.ApiExtraModels)
  @ApiResponse(RecoveryDocs.LoginGenRecKeys.ApiResponse)
  @ApiBadRequestResponse(RecoveryDocs.LoginGenRecKeys.ApiBadRequestResponse)
  @ApiBody(RecoveryDocs.LoginGenRecKeys.ApiBody)
  @UsePipes(ValidationPipe)
  @Post('login-generate-recovery-keys')
  loginGenerateRecoveryKeys(
    @Body() payload: LoginGenerateRecoveryKeysDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.recoveryService.loginGenerateRecoveryKeys({
      payload,
      trx
    });
  }

  @ApiOperation(RecoveryDocs.GenerateRecoveryKeys.ApiOperation)
  @ApiExtraModels(...RecoveryDocs.GenerateRecoveryKeys.ApiExtraModels)
  @ApiResponse(RecoveryDocs.GenerateRecoveryKeys.ApiResponse)
  @ApiBody(RecoveryDocs.GenerateRecoveryKeys.ApiBody)
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('generate-recovery-keys')
  generateRecoveryKeys(
    @Body() payload: GenerateRecoveryKeysDto,
    @UserId() userId: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.recoveryService.generateRecoveryKeys({
      payload,
      userId,
      trx
    });
  }

  @ApiOperation(RecoveryDocs.RecoveryAccount.ApiOperation)
  @ApiExtraModels(...RecoveryDocs.RecoveryAccount.ApiExtraModels)
  @ApiResponse(RecoveryDocs.RecoveryAccount.ApiResponse)
  @ApiBadRequestResponse(RecoveryDocs.RecoveryAccount.ApiBadRequestResponse)
  @ApiBody(RecoveryDocs.RecoveryAccount.ApiBody)
  @UsePipes(ValidationPipe)
  @Post('recover-account')
  recoverUserAccount(
    @Body() payload: RecoverAccountDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.recoveryService.recoverUserAccount({ payload, trx });
  }
}
