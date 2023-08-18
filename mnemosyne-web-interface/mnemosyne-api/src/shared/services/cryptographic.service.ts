import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';
import * as bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { HashInterface } from '@interfaces/hash.interface';
import { HashPassphraseInterface } from '@interfaces/hash-passphrase.interface';
import { EncryptInterface } from '@interfaces/encrypt.interface';
import { DecryptInterface } from '@interfaces/decrypt.interface';
import { EncryptRecoveryKeysInterface } from '@interfaces/encrypt-recovery-keys.interface';
import { DecryptRecoveryKeysInterface } from '@interfaces/decrypt-recovery-keys.interface';
import { HashPasswordInterface } from '@interfaces/hash-password.interface';
import { ComparePasswordsInterface } from '@interfaces/compare-passwords.interface';

@Injectable()
export class CryptographicService {
  recoveryKeySize = this.configService.recoveryEncryptionData.recoveryKeySize;
  iterations = this.configService.recoveryEncryptionData.iterations;
  salt = this.configService.recoveryEncryptionData.salt;
  iv = this.configService.recoveryEncryptionData.iv;

  constructor(private readonly configService: ApiConfigService) {}

  hash({ data, algorithm }: HashInterface) {
    switch (algorithm) {
      case 'SHA512':
        return CryptoJS.SHA512(data, {
          iterations: this.iterations
        }).toString();
      case 'MD5':
        return CryptoJS.MD5(data, {
          iterations: this.iterations
        }).toString();
    }
  }

  hashPassphrase({ passphrase }: HashPassphraseInterface) {
    return CryptoJS.PBKDF2(passphrase, this.salt, {
      keySize: this.recoveryKeySize / 32,
      iterations: this.iterations
    }).toString();
  }

  async hashPassword({ password }: HashPasswordInterface) {
    return await bcryptjs.hash(password, this.configService.hashPasswordRounds);
  }

  async comparePasswords({ dataToCompare, hash }: ComparePasswordsInterface) {
    return await bcryptjs.compare(dataToCompare, hash);
  }

  encrypt({ data, passphrase }: EncryptInterface) {
    const key = CryptoJS.enc.Base64.parse(passphrase);
    const iv = CryptoJS.enc.Base64.parse(this.iv);

    return CryptoJS.AES.encrypt(data, key, { iv }).toString();
  }

  decrypt({ ciphertext, passphrase }: DecryptInterface) {
    const key = CryptoJS.enc.Base64.parse(passphrase);
    const iv = CryptoJS.enc.Base64.parse(this.iv);

    return CryptoJS.AES.decrypt(ciphertext, key, { iv }).toString(
      CryptoJS.enc.Utf8
    );
  }

  generateRecoveryKey() {
    const recoveryKeys: Array<string> = [];

    [...Array(5)].forEach(() => {
      const randomBytes = CryptoJS.lib.WordArray.random(this.recoveryKeySize);
      recoveryKeys.push(randomBytes.toString());
    });

    return recoveryKeys;
  }

  encryptRecoveryKeys({
    recoveryKeys,
    hashedPassphrase
  }: EncryptRecoveryKeysInterface) {
    const recoveryKeysStr = recoveryKeys.join(',');
    return this.encrypt({
      data: recoveryKeysStr,
      passphrase: hashedPassphrase
    });
  }

  decryptRecoveryKeys({
    encryptedRecoveryKeys,
    hashedPassphrase
  }: DecryptRecoveryKeysInterface) {
    return this.decrypt({
      ciphertext: encryptedRecoveryKeys,
      passphrase: hashedPassphrase
    });
  }

  generateConfirmationHash() {
    return crypto.randomBytes(20).toString('hex');
  }
}
