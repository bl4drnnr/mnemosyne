import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  finalize,
  mergeMap,
  Observable,
  throwError,
  timer
} from 'rxjs';
import { GlobalMessageService } from '@shared/global-message.service';
import { EnvService } from '@shared/env.service';
import { ErrorHandlerService } from '@shared/api/error-handler.service';
import { LoaderService } from '@shared/loader.service';
import { CONTROLLERS } from '@interfaces/controllers.type';
import { ALLOWED_METHODS } from '@interfaces/methods.type';
import { AUTH_ENDPOINTS } from '@interfaces/auth.type';
import { SECURITY_ENDPOINTS } from '@interfaces/security.type';
import { USERS_ENDPOINTS } from '@interfaces/users.type';
import { RECOVERY_ENDPOINTS } from '@interfaces/recovery';

type ENDPOINTS_TYPE =
  | AUTH_ENDPOINTS
  | SECURITY_ENDPOINTS
  | USERS_ENDPOINTS
  | RECOVERY_ENDPOINTS;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly globalMessageService: GlobalMessageService,
    private readonly loaderService: LoaderService,
    private readonly envService: EnvService,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  private frontProxyUrl: string = this.envService.getFrontProxyUrl;

  apiProxyRequest({
    controller,
    action,
    method,
    payload,
    params,
    accessToken
  }: {
    controller: CONTROLLERS;
    action: ENDPOINTS_TYPE;
    method: ALLOWED_METHODS;
    payload?: object;
    params?: object;
    accessToken?: string;
  }): Observable<any> {
    const requestUrl = `${this.frontProxyUrl}/${controller}/${action}`;
    const requestBody: {
      method: ALLOWED_METHODS;
      params?: object;
      payload?: object;
    } = { method };
    const headers: { [key: string]: string } = {};

    if (params) requestBody.params = params;
    if (payload) requestBody.payload = payload;
    if (accessToken) headers['X-Access-Token'] = accessToken;

    const request$ = this.http.post<any>(requestUrl, requestBody, {
      withCredentials: true,
      headers
    });

    const loaderTimeout$ = timer(1000).pipe(
      mergeMap(() => {
        this.loaderService.start();
        return request$;
      })
    );

    return loaderTimeout$.pipe(
      catchError((error) => {
        this.errorHandler.errorHandler(error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.loaderService.stop();
      })
    );
  }
}
