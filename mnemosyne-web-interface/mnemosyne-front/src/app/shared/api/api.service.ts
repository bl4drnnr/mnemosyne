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
import { ErrorHandlerService } from '@shared/services/error-handler.service';
import { LoaderService } from '@shared/loader.service';
import { CONTROLLERS_TYPE } from '@interfaces/controllers.type';
import { ENDPOINTS_TYPE } from '@interfaces/endpoints.type';
import { ALLOWED_METHODS_TYPE } from '@interfaces/methods.type';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private globalMessageService: GlobalMessageService,
    private loaderService: LoaderService,
    private envService: EnvService,
    private errorHandler: ErrorHandlerService
  ) {}

  private frontProxyUrl: string = this.envService.getFrontProxyUrl;

  apiProxyRequest({
    controller,
    action,
    method,
    payload,
    params
  }: {
    controller: CONTROLLERS_TYPE;
    action: ENDPOINTS_TYPE;
    method: ALLOWED_METHODS_TYPE;
    payload?: object;
    params?: object;
  }): Observable<any> {
    const requestUrl = `${this.frontProxyUrl}/${controller}/${action}`;
    const requestBody: {
      method: ALLOWED_METHODS_TYPE;
      params?: object;
      payload?: object;
    } = { method };

    if (params) requestBody.params = params;
    if (payload) requestBody.payload = payload;

    const request$ = this.http.post<any>(requestUrl, requestBody);

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
