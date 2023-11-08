import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, mergeMap, Observable, timer } from 'rxjs';
import { EnvService } from '@shared/env.service';
import { ErrorHandlerService } from '@shared/api/error-handler.service';
import { LoaderService } from '@shared/loader.service';
import { Method } from '@interfaces/methods.enum';
import { ProxyRequestInterface } from '@interfaces/proxy-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private readonly http: HttpClient,
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
  }: ProxyRequestInterface): Observable<any> {
    const requestUrl = `${this.frontProxyUrl}/${controller}/${action}`;
    const requestBody: {
      method: Method;
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
      catchError(async (error) => {
        await this.errorHandler.errorHandler(error);
        throw error;
      }),
      finalize(() => {
        this.loaderService.stop();
      })
    );
  }
}
