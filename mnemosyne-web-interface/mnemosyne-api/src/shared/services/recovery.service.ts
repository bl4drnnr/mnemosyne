import * as CryptoJS from 'crypto-js';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';

@Injectable()
export class RecoveryService {
  recoveryKeySize: number =
    this.configService.recoveryEncryptionData.recoveryKeySize;
  iterations: number = this.configService.recoveryEncryptionData.iterations;

  constructor(private readonly configService: ApiConfigService) {}

  hash(data: string) {
    return CryptoJS.SHA512(data).toString();
  }

  encrypt(data: string, passphrase: string) {
    return CryptoJS.AES.encrypt(data, passphrase).toString();
  }

  decrypt(ciphertext: string, passphrase: string) {
    return CryptoJS.AES.decrypt(ciphertext, passphrase).toString(
      CryptoJS.enc.Utf8
    );
  }

  generateRecoveryKey(): string {
    let recoveryKeys = '';

    [...Array(5)].forEach(() => {
      const randomBytes = CryptoJS.lib.WordArray.random(this.recoveryKeySize);
      recoveryKeys += randomBytes.toString();
    });

    return recoveryKeys;
  }

  encryptRecoveryKeys(recoveryKeys: string, hashedPassphrase: string) {
    return this.encrypt(recoveryKeys, hashedPassphrase);
  }

  decryptRecoveryKeys(encryptedRecoveryKeys: string, hashedPassphrase: string) {
    return this.decrypt(encryptedRecoveryKeys, hashedPassphrase);
  }
}
