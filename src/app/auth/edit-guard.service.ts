import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { CanActivate } from '@angular/router';

@Injectable()
export class EditGuard implements CanActivate{
  canEdit: boolean;

  constructor(private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if (this.canEdit){
      return true;
    }
    else{
      this.router.navigate(['']);
    }
  }

}