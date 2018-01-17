import { ErrorHandler, Injectable, Injector} from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler{

  constructor(private injector: Injector){}

  handleError(error){
    console.log(error)
    if (error.status == '401'){
      alert('Please login again');
    }
    else{
      alert('That page does not exist.');
      const router = this.injector.get(Router);
      router.navigate(['']);
    }
  }
}