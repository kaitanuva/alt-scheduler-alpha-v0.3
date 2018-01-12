import { Injectable } from '@angular/core';
import { CanActivate, 
         ActivatedRouteSnapshot, 
         RouterStateSnapshot,
         ActivatedRoute,
         Params,
         Router
       } from '@angular/router';
import { SchoolService } from '../shared/school.service';
import { AuthService } from './auth.service';

@Injectable()
export class SchoolGuard implements CanActivate{
  id: number;

  constructor(private schoolService: SchoolService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router
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