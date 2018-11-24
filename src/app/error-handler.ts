import { ErrorHandler, Injectable, Injector} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler{

  constructor(private injector: Injector){}

  handleError(error){
    console.log(error);
    if (error.status == '401'){
      const authService = this.injector.get(AuthService);
      authService.logout();
    }
    else if (error.code == 'auth/invalid-email'){
      alert('The email address is badly formatted.')
    }
    else{
      alert('That page does not exist.');
      const router = this.injector.get(Router);
      router.navigate(['']);
    }
  }
}