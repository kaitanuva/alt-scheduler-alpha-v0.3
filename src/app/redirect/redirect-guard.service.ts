import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { RedirectService } from './redirect.service';

@Injectable()
export class RedirectGuard implements CanActivate{

  constructor(private redirectService: RedirectService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if (this.redirectService.redirectRoute){
      return true;
    }
    else{
      return false;
    }
  }
}