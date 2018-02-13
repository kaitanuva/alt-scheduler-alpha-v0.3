import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MainGuard implements CanActivate{

  constructor(public authService: AuthService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if (this.authService.userType == 'main'){
      return true;
    }
    else {
      return false;
    }
  }

}