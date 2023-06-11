import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environmental variable is not set');
    }

    return value;
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  private getArray(key: string): Array<string> {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n').split(',');
  }

  get basicAuthConfig() {
    return {
      username: this.getString('BASIC_AUTH_USERNAME'),
      password: this.getString('BASIC_AUTH_PASSWORD')
    };
  }

  get allowedRequestMethods() {
    return this.getArray('ALLOWED_METHODS');
  }

  get allowedControllers() {
    return this.getArray('ALLOWED_CONTROLLERS');
  }

  get allowedEndpoints() {
    return this.getArray('ALLOWED_ENDPOINTS');
  }

  get originApiUrl() {
    return this.getString('ORIGIN_API_URL');
  }
}
