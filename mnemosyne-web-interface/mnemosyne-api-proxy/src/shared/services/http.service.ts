import { BadRequestException, Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiConfigService } from '@shared/config.service';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyHttpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ApiConfigService
  ) {}

  async proxyRequest({
    controller,
    action,
    payload,
    method,
    params,
    signUpApiAuthToken
  }: {
    controller: string;
    action: string;
    payload?: object;
    method: string;
    params?: object;
    signUpApiAuthToken?: string;
  }) {
    const allowedMethods = this.configService.allowedRequestMethods;
    const allowedControllers = this.configService.allowedControllers;
    const allowedEndpoints = this.configService.allowedEndpoints;

    const originApiUrl = this.configService.originApiUrl;

    if (
      !allowedMethods.includes(method) ||
      !allowedEndpoints.includes(action) ||
      !allowedControllers.includes(controller)
    )
      throw new BadRequestException('no-method-controller-or-action');

    const { username, password } = this.configService.basicAuthConfig;

    const requestUrl = `${originApiUrl}/${controller}/${action}`;
    const basicAuth = 'Basic ' + btoa(username + ':' + password);

    const requestConfig: AxiosRequestConfig = {
      method,
      url: requestUrl,
      headers: {
        'Content-Type': 'application/json',
        authorization: basicAuth
      }
    };

    if (action === 'sign-up') {
      requestConfig.headers['registration-authorization'] = signUpApiAuthToken;
    }

    requestConfig.data = method === 'POST' ? payload : {};
    requestConfig.params = params ? params : {};

    return firstValueFrom(this.httpService.request(requestConfig))
      .then((res) => res.data)
      .catch((error: any) => {
        throw new HttpException(
          error.response?.data?.error || 'Internal server error',
          error.response?.data?.statusCode || 500
        );
      });
  }
}
