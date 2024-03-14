import { HttpException, Injectable } from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { UsersService } from '@modules/users.service';
import { AccountRecoveredDto } from '@dto/account-recovered.dto';
import { CryptographicService } from '@shared/cryptographic.service';
import { WrongRecoveryKeysException } from '@exceptions/wrong-recovery-keys.exception';
import { RegistrationKeysInterface } from '@interfaces/registration-keys.interface';
import { LoginKeysInterface } from '@interfaces/login-keys.interface';
import { GenerateKeysInterface } from '@interfaces/generate-keys.interface';
import { RecoverAccountInterface } from '@interfaces/recover-account.interface';
import { GenerateAndSaveKeysInterface } from '@interfaces/generate-and-save-keys.interface';
import { CryptoHashAlgorithm } from '@interfaces/crypto-hash-algorithm.enum';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { RecoveryKeysResponseDto } from '@dto/recovery-keys.dto';

@Injectable()
export class RecoveryService {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService,
    private readonly cryptographicService: CryptographicService,
    private readonly usersService: UsersService
  ) {}

  async testFunc(email: string) {
    const user = await this.usersService.getUserByEmail({
      email
    });
    console.log('user', user);
    if (!user) throw new WrongRecoveryKeysException();
    return user;
  }

  async registrationGenerateRecoveryKeys({
    confirmationHash,
    payload,
    trx
  }: RegistrationKeysInterface) {
    const { passphrase } = payload;

    const { userId } =
      await this.confirmationHashService.getUserIdByConfirmationHash({
        confirmationHash,
        confirmationType: Confirmation.REGISTRATION,
        trx
      });

    try {
      return await this.generateAndSaveRecoveryKeys({
        passphrase,
        userId,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  async loginGenerateRecoveryKeys({ payload, trx }: LoginKeysInterface) {
    const { email, password, passphrase } = payload;

    const { id: userId } = await this.usersService.verifyUserCredentials({
      email,
      password,
      trx
    });

    try {
      return await this.generateAndSaveRecoveryKeys({
        passphrase,
        userId,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  async generateRecoveryKeys({ payload, userId, trx }: GenerateKeysInterface) {
    const { passphrase } = payload;

    try {
      return await this.generateAndSaveRecoveryKeys({
        passphrase,
        userId,
        trx
      });
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }
  }

  async recoverUserAccount({ payload, trx }: RecoverAccountInterface) {
    const { passphrase, recoveryKeys } = payload;

    const hashedPassphrase = this.cryptographicService.hashPassphrase({
      passphrase
    });

    const encryptedRecoveryKeys = this.cryptographicService.encryptRecoveryKeys(
      {
        recoveryKeys,
        hashedPassphrase
      }
    );

    const recoveryKeysFingerprint = this.cryptographicService.hash({
      data: encryptedRecoveryKeys,
      algorithm: CryptoHashAlgorithm.SHA512
    });

    const { id: userId, userSettings } =
      await this.usersService.getUserByRecoveryKeysFingerprint({
        recoveryKeysFingerprint,
        trx
      });

    if (userSettings.recoveryKeysFingerprint !== recoveryKeysFingerprint)
      throw new WrongRecoveryKeysException();

    await this.usersService.updateUserSettings({
      payload: {
        phone: null,
        phoneCode: null,
        codeSentAt: null,
        twoFaToken: null,
        recoveryKeysFingerprint: null
      },
      userId,
      trx
    });

    await this.usersService.updateUser({
      payload: { isMfaSet: false },
      userId,
      trx
    });

    return new AccountRecoveredDto();
  }

  private async generateAndSaveRecoveryKeys({
    passphrase,
    userId,
    trx
  }: GenerateAndSaveKeysInterface) {
    const recoveryKeys = this.cryptographicService.generateRecoveryKey();

    const hashedPassphrase = this.cryptographicService.hashPassphrase({
      passphrase
    });

    const encryptedRecoveryKeys = this.cryptographicService.encryptRecoveryKeys(
      {
        recoveryKeys,
        hashedPassphrase
      }
    );

    const recoveryKeysFingerprint = this.cryptographicService.hash({
      data: encryptedRecoveryKeys,
      algorithm: CryptoHashAlgorithm.SHA512
    });

    await this.usersService.updateUserSettings({
      payload: { recoveryKeysFingerprint },
      userId,
      trx
    });

    return new RecoveryKeysResponseDto(recoveryKeys);
  }
}
