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
    phone,
    firstName,
    lastName
  }: {
    email: string;
    password: string;
    tac: boolean;
    phone: string;
    firstName: string;
    lastName: string;
  }): Observable<{ message: string }> {
    const registrationUrl = `${this.frontProxyUrl}/auth/registration`;

    return this.http
      .post<{ message: string }>(registrationUrl, {
        method: 'POST',
        payload: { email, password, firstName, lastName, tac, phone }
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
    const forgotPassword = `${this.frontProxyUrl}/auth/forgot-password`;

    return this.http
      .post<{ message: string }>(forgotPassword, {
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
