import { Injectable } from '@angular/core';
import { CanActivate, 
         ActivatedRouteSnapshot, 
         RouterStateSnapshot
       } from '@angular/router';
import { SchoolService } from '../shared/school.service';
import { AuthService } from './auth.service';

@Injectable()
export class SchoolGuard implements CanActivate{

  constructor(public schoolService: SchoolService,
              public authService: AuthService
             ){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if (this.authService.userType == 'school'){
      if (this.schoolService.loggedInSchoolIndex != null &&
        this.schoolService.loggedInSchoolIndex == this.schoolService.selectedSchoolIndex){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return true;
    }
  }
}