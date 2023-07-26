import { HttpException, Injectable } from '@nestjs/common';
import { GenerateRecoveryKeysDto } from '@dto/generate-recovery-keys.dto';
import { Transaction } from 'sequelize';
import { RecoverAccountDto } from '@dto/recover-account.dto';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { UsersService } from '@modules/users.service';
import { LoginGenerateRecoveryKeysDto } from '@dto/login-generate-recovery-keys.dto';
import { RecoveryKeysGeneratedDto } from '@dto/recovery-keys-generated.dto';
import { AccountRecoveredDto } from '@dto/account-recovered.dto';

@Injectable()
export class RecoveryService {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService,
    private readonly userService: UsersService
  ) {}

  async registrationGenerateRecoveryKeys({
    confirmationHash,
    payload,
    trx
  }: {
    confirmationHash: string;
    payload: GenerateRecoveryKeysDto;
    trx?: Transaction;
  }) {
    const { userId } =
      await this.confirmationHashService.getUserByConfirmationHash({
        confirmationHash,
        trx
      });

    try {
      return await this.generateAndSaveRecoveryKeys({
        passphrase: payload.passphrase,
        userId,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  async loginGenerateRecoveryKeys({
    payload,
    trx
  }: {
    payload: LoginGenerateRecoveryKeysDto;
    trx?: Transaction;
  }) {
    const user = await this.userService.verifyUserCredentials({
      email: payload.email,
      password: payload.password,
      trx
    });

    try {
      return await this.generateAndSaveRecoveryKeys({
        passphrase: payload.passphrase,
        userId: user.id,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  async generateRecoveryKeys({
    payload,
    userId,
    trx
  }: {
    payload: GenerateRecoveryKeysDto;
    userId: string;
    trx?: Transaction;
  }) {
    try {
      return await this.generateAndSaveRecoveryKeys({
        passphrase: payload.passphrase,
        userId,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  async recoverUserAccount({
    payload,
    trx
  }: {
    payload: RecoverAccountDto;
    trx?: Transaction;
  }) {
    return new AccountRecoveredDto();
  }

  private async generateAndSaveRecoveryKeys({
    passphrase,
    userId,
    trx
  }: {
    passphrase: string;
    userId: string;
    trx?: Transaction;
  }) {
    return new RecoveryKeysGeneratedDto();
  }
}