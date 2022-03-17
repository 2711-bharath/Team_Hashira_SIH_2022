import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const path = route.url[0].path
      if(path === 'register-business') {
        if (!this.auth.isLoggedIn) {
          this.router.navigate(['login']);
          return false;
        }
        return true;
      } else {
        if (this.auth.isLoggedIn) {
          this.router.navigate(['register-business']);
          return false;
        }
        return true
      }
  }
  
}