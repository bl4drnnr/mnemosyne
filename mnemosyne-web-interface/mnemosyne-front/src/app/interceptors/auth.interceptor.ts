import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken = localStorage.getItem('_at');
    const modifiedReq = request.clone({
      headers: request.headers.set('X-Access-Token', `Bearer ${authToken}`)
    });
    return next.handle(modifiedReq);
  }
}
