import { ErrorHandler, Injectable} from '@angular/core';
// import * as StackTrace from 'stacktrace-js';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler{

  constructor(){}

  handleError(error){
    console.log('hi')

    // throw error;
  }
}