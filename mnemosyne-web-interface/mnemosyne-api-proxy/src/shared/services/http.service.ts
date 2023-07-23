import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiConfigService } from '@shared/config.service';
import { AxiosRequestConfig } from 'axios';
import { LoggerService } from '@shared/logger.service';
import { ACTION_CONTROLLER_TYPE } from '@interfaces/action-controller.type';
import { STATUS_TYPE } from '@interfaces/status.type';
import { METHODS_TYPE } from '@interfaces/method.type';

@Injectable()
export class ProxyHttpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ApiConfigService,
    private readonly loggerService: LoggerService
  ) {}

  async proxyRequest({
    controller,
    action,
    payload,
    method,
    params,
    accessToken,
    cookies
  }: {
    controller: string;
    action: string;
    payload?: object;
    method: string;
    params?: object;
    accessToken?: string;
    cookies?: string;
  }): Promise<object> {
    const allowedMethods = this.configService.allowedRequestMethods;
    const allowedControllers = this.configService.allowedControllers;
    const allowedEndpoints = this.configService.allowedEndpoints;

    const originApiUrl = this.configService.originApiUrl;

    if (
      !allowedMethods.includes(method) ||
      !allowedEndpoints.includes(action) ||
      !allowedControllers.includes(controller)
    ) {
      const logMessage = { method, action, controller, payload };
      await this.loggerService.log({
        logType: ACTION_CONTROLLER_TYPE.PROXY_SERVICE,
        status: STATUS_TYPE.ERROR,
        message: `Proxy tried to handle unsupported endpoint: ${logMessage.toString()}`
      });
      throw new BadRequestException('unhandled-endpoint');
    }

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

    const bodySupportMethod = ['POST', 'PATCH', 'DELETE'];

    requestConfig.data = bodySupportMethod.includes(method) ? payload : {};
    requestConfig.params = params ? params : {};

    if (accessToken) requestConfig.headers['X-Access-Token'] = accessToken;
    if (cookies) requestConfig.headers.cookie = cookies;

    await this.loggerService.log({
      logType: ACTION_CONTROLLER_TYPE.LOGGER_SERVICE,
      method: method as METHODS_TYPE,
      controller,
      endpoint: action,
      status: STATUS_TYPE.INFO,
      payload: { body: payload, params }
    });

    return new Promise((resolve, reject) => {
      this.httpService.request(requestConfig).subscribe({
        next: (res) => {
          resolve(res.data);
        },
        error: async (error: any) => {
          await this.loggerService.log({
            logType: ACTION_CONTROLLER_TYPE.PROXY_SERVICE,
            status: STATUS_TYPE.ERROR,
            message: 'Error occurs while handling response from the API.',
            error: error.response?.data,
            payload: { body: payload, params }
          });

          let errorMessage = error.response?.data;

          try {
            errorMessage = { messages: JSON.parse(errorMessage.message) };
          } catch (e) {
            errorMessage = error.response?.data;
          }

          reject(
            new HttpException(
              errorMessage || 'internal-server-error',
              error.response?.data?.statusCode || 500
            )
          );
        }
      });
    });
  }
}
