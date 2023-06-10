import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
// import { GlobalMessageService } from '@services/global-message.service';
// import { EnvService } from '@services/env.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient // private globalMessageService: GlobalMessageService, // private envService: EnvService
  ) {}

  // frontProxyUrl: string = this.envService.getFrontProxyUrl;

  login({ email, password }: { email: string; password: string }) {
    // : Observable<{ _at: string }>
    // const loginUrl = `${this.frontProxyUrl}/users/sign-in`;
    //
    // return this.http
    //   .post<{ _at: string }>(loginUrl, {
    //     method: 'POST',
    //     payload: { email, password }
    //   })
    //   .pipe(catchError(this.errorHandler.bind(this)));
  }
}
