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

@Injectable()
export class RecoveryService {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService,
    private readonly cryptographicService: CryptographicService,
    private readonly userService: UsersService
  ) {}

  async registrationGenerateRecoveryKeys({
    confirmationHash,
    payload,
    trx
  }: RegistrationKeysInterface) {
    const { passphrase } = payload;

    const { userId } =
      await this.confirmationHashService.getUserIdByConfirmationHash({
        confirmationHash,
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

    const { id: userId } = await this.userService.verifyUserCredentials({
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
      data: encryptedRecoveryKeys
    });

    const { id: userId, userSettings } =
      await this.userService.getUserByRecoveryKeysFingerprint({
        recoveryKeysFingerprint,
        trx
      });

    if (userSettings.recoveryKeysFingerprint !== recoveryKeysFingerprint)
      throw new WrongRecoveryKeysException();

    await this.userService.updateUserSettings({
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

    await this.userService.updateUser({
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
      data: encryptedRecoveryKeys
    });

    await this.userService.updateUserSettings({
      payload: { recoveryKeysFingerprint },
      userId,
      trx
    });

    return { recoveryKeys };
  }
}
