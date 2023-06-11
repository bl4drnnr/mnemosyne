import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginService } from '@pages/login/shared/login.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.loginService.isLoggedIn$.pipe(
      tap(async (isLoggedIn) => {
        if (!isLoggedIn) await this.router.navigate(['login']);
      })
    );
  }
}
