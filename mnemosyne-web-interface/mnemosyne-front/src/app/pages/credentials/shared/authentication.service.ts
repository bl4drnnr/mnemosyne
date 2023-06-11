import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private apiService: ApiService) {
    const token = sessionStorage.getItem('_at');
    this._isLoggedIn$.next(!!token);
  }

  login({ email, password }: { email: string; password: string }) {
    return this.apiService.apiProxyLogin({ email, password }).pipe(
      tap(({ _at }) => {
        sessionStorage.setItem('_at', _at);
        this._isLoggedIn$.next(true);
      })
    );
  }

  registration({
    email,
    password,
    firstName,
    lastName
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    //
  }
}
