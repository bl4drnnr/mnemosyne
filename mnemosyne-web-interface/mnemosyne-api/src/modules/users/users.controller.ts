import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { UsersService } from '@modules/users.service';
import { ForgotPasswordDto } from '@dto/forgot-password.dto';
import { ResetUserPasswordDto } from '@dto/reset-user-password.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { UploadPhotoDto } from '@dto/upload-photo.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(ValidationPipe)
  @Post('forgot-password')
  async forgotPassword(
    @Body() payload: ForgotPasswordDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.usersService.forgotPassword({ payload, trx });
  }

  @UsePipes(ValidationPipe)
  @Post('reset-user-password')
  async resetUserPassword(
    @Body() payload: ResetUserPasswordDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.usersService.resetUserPassword({ payload, trx });
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('upload-user-photo')
  async uploadUserPhoto(
    @Body() payload: UploadPhotoDto,
    @UserId() userId: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.usersService.uploadUserPhoto({
      payload,
      userId,
      trx
    });
  }
}
