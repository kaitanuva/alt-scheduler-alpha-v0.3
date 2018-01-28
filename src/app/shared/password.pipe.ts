import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'password'
})
export class PasswordPipe implements PipeTransform{
  transform(value: any){
    let transformedToPW;
    let passArray = [];

    if (value){
      for (let i = 0; i < value.length; i++){
        passArray.push('•');
      }
      transformedToPW = passArray.join('');
      return transformedToPW;
    }
  }
}