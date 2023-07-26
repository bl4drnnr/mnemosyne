import * as CryptoJS from 'crypto-js';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';

@Injectable()
export class CryptographicService {
  recoveryKeySize = this.configService.recoveryEncryptionData.recoveryKeySize;
  iterations = this.configService.recoveryEncryptionData.iterations;
  salt = this.configService.recoveryEncryptionData.salt;
  iv = this.configService.recoveryEncryptionData.iv;

  constructor(private readonly configService: ApiConfigService) {}

  hash({ data }: { data: string }) {
    return CryptoJS.SHA512(data, {
      iterations: this.iterations
    }).toString();
  }

  hashPassphrase({ passphrase }: { passphrase: string }) {
    return CryptoJS.PBKDF2(passphrase, this.salt, {
      keySize: this.recoveryKeySize / 32,
      iterations: this.iterations
    }).toString();
  }

  encrypt({ data, passphrase }: { data: string; passphrase: string }) {
    const key = CryptoJS.enc.Base64.parse(passphrase);
    const iv = CryptoJS.enc.Base64.parse(this.iv);

    return CryptoJS.AES.encrypt(data, key, { iv }).toString();
  }

  decrypt({
    ciphertext,
    passphrase
  }: {
    ciphertext: string;
    passphrase: string;
  }) {
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
  }: {
    recoveryKeys: Array<string>;
    hashedPassphrase: string;
  }) {
    const recoveryKeysStr = recoveryKeys.join(',');
    return this.encrypt({
      data: recoveryKeysStr,
      passphrase: hashedPassphrase
    });
  }

  decryptRecoveryKeys({
    encryptedRecoveryKeys,
    hashedPassphrase
  }: {
    encryptedRecoveryKeys: string;
    hashedPassphrase: string;
  }) {
    return this.decrypt({
      ciphertext: encryptedRecoveryKeys,
      passphrase: hashedPassphrase
    });
  }
}
