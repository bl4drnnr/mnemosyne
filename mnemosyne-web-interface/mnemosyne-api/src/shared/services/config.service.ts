import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    return Number(value);
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get jwtAuthConfig() {
    return {
      accessExpiresIn: this.getString('JWT_ACCESS_EXPIRES_IN'),
      refreshExpiresIn: this.getString('JWT_REFRESH_EXPIRES_IN'),
      secret: this.getString('JWT_SECRET')
    };
  }

  get basicAuthConfig() {
    return {
      username: this.getString('BASIC_AUTH_USERNAME'),
      password: this.getString('BASIC_AUTH_PASSWORD')
    };
  }

  get hashPasswordRounds() {
    return this.getNumber('HASH_PASSWORD_ROUNDS');
  }

  get sendGridCredentials() {
    return {
      apiKey: this.getString('SENDGRID_API_KEY'),
      senderEmail: this.getString('SENDGRID_SENDER_EMAIL')
    };
  }

  get frontEndUrl() {
    return this.getString('FRONT_END_URL');
  }

  get twilioCredentials() {
    return {
      twilioAuthPhone: this.getString('TWILIO_AUTH_PHONE'),
      twilioAccountSid: this.getString('TWILIO_ACCOUNT_SID'),
      twilioAuthToken: this.getString('TWILIO_AUTH_TOKEN')
    };
  }

  get awsSdkCredentials() {
    return {
      accessKeyId: this.getString('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.getString('AWS_SECRET_ACCESS_KEY'),
      bucketName: this.getString('AWS_S3_NAME')
    };
  }

  get recoveryEncryptionData() {
    return {
      iterations: this.getNumber('RECOVERY_ENCRYPTION_ITERATIONS'),
      recoveryKeySize: this.getNumber('RECOVERY_ENCRYPTION_KEY_SIZE'),
      salt: this.getString('RECOVERY_ENCRYPTION_SALT'),
      iv: this.getString('RECOVERY_ENCRYPTION_IV')
    };
  }
}
