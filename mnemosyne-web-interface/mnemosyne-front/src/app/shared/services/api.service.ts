import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { GlobalMessageService } from '@shared/global-message.service';
import { EnvService } from '@shared/env.service';
import { ErrorHandlerService } from '@shared/services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private globalMessageService: GlobalMessageService,
    private envService: EnvService,
    private errorHandler: ErrorHandlerService
  ) {}

  frontProxyUrl: string = this.envService.getFrontProxyUrl;

  apiProxyLogin({
    email,
    password
  }: {
    email: string;
    password: string;
  }): Observable<{ _at: string }> {
    const loginUrl = `${this.frontProxyUrl}/users/sign-in`;

    return this.http
      .post<{ _at: string }>(loginUrl, {
        method: 'POST',
        payload: { email, password }
      })
      .pipe(
        catchError((error) => {
          this.errorHandler.errorHandler(error);
          return throwError(() => error);
        })
      );
  }
}
