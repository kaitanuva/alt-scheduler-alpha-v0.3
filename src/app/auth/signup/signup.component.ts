import { NgForm, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  pages = [
    {page: 'schoolsysPage', on: true},
    {page: 'altPage', on: false},
    {page: 'schoolsPage', on: false},
    {page: 'submitPage', on: false}
  ]
  activePage = this.findActivePage().page;
  progress = '25';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // this.signupForm = new FormGroup({
    //   'username': new FormControl()
    // });
  }

  findActivePage(){
    const activePage = this.pages.find((v,i) => {return v["on"] == true});
    return activePage;
  }

  onNext(){
    console.log('hi')
    // console.log(form.value.username)
    // console.log(form.value.schoolsys)
    // console.log(form.value.password)
  }

  onSignup(form: NgForm){
    // const username = form.value.username;
    // const password = form.value.password;
    // this.authService.signupUser(username, password);
  }

}
