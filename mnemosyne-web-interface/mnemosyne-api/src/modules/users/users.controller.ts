import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { UsersService } from '@modules/users.service';
import { ForgotPasswordDto } from '@dto/forgot-password.dto';
import { ResetUserPasswordDto } from '@dto/reset-user-password.dto';
import { TransactionInterceptor } from '@interceptors/transaction.interceptor';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(TransactionInterceptor)
  @UsePipes(ValidationPipe)
  @Post('forgot-password')
  async forgotPassword(
    @Body() payload: ForgotPasswordDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.usersService.forgotPassword({ payload, trx });
  }

  @UseInterceptors(TransactionInterceptor)
  @UsePipes(ValidationPipe)
  @Post('reset-user-password')
  async resetUserPassword(
    @Body() payload: ResetUserPasswordDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.usersService.resetUserPassword({ payload, trx });
  }
}
