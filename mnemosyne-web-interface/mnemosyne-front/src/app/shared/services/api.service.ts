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
    const loginUrl = `${this.frontProxyUrl}/auth/login`;

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

  apiProxyRegistration({
    email,
    password,
    tac,
    firstName,
    lastName
  }: {
    email: string;
    password: string;
    tac: boolean;
    firstName: string;
    lastName: string;
  }): Observable<{ message: string }> {
    const registrationUrl = `${this.frontProxyUrl}/auth/registration`;

    return this.http
      .post<{ message: string }>(registrationUrl, {
        method: 'POST',
        payload: { email, password, firstName, lastName, tac }
      })
      .pipe(
        catchError((error) => {
          this.errorHandler.errorHandler(error);
          return throwError(() => error);
        })
      );
  }

  apiProxyConfirmAccount({
    hash
  }: {
    hash: string;
  }): Observable<{ message: string }> {
    const confirmationHashUrl = `${this.frontProxyUrl}/users/account-confirmation`;

    return this.http
      .post<{ message: string }>(confirmationHashUrl, {
        method: 'GET',
        params: { hash }
      })
      .pipe(
        catchError((error) => {
          this.errorHandler.errorHandler(error);
          return throwError(() => error);
        })
      );
  }

  apiProxyGenerateTwoFaQrCode({
    hash
  }: {
    hash: string;
  }): Observable<{ qr: string }> {
    const generateTwoFaCode = `${this.frontProxyUrl}/security/generate-2fa-qr`;

    return this.http
      .post<{ qr: string }>(generateTwoFaCode, {
        method: 'POST',
        payload: { confirmationHash: hash }
      })
      .pipe(
        catchError((error) => {
          this.errorHandler.errorHandler(error);
          return throwError(() => error);
        })
      );
  }

  apiProxyForgotPassword({
    email
  }: {
    email: string;
  }): Observable<{ message: string }> {
    const forgotPasswordUrl = `${this.frontProxyUrl}/auth/forgot-password`;

    return this.http
      .post<{ message: string }>(forgotPasswordUrl, {
        method: 'POST',
        payload: { email }
      })
      .pipe(
        catchError((error) => {
          this.errorHandler.errorHandler(error);
          return throwError(() => error);
        })
      );
  }
}
