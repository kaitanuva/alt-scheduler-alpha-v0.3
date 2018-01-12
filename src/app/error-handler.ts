import { ErrorHandler, Injectable, Injector} from '@angular/core';
import { Router } from '@angular/router';
// import * as StackTrace from 'stacktrace-js';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler{

  constructor(private injector: Injector){}

  handleError(error){
    console.log(error)
    alert('That page does not exist.');
    const router = this.injector.get(Router);
    router.navigate(['']);
  }
}