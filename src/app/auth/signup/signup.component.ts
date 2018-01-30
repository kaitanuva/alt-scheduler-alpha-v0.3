import { DataStorageService } from './../../shared/data-storage.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { NgForm, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  onPagesChange = new Subject<any[]>();
  pages = [
    {page: 'schoolsysPage', on: true},
    {page: 'altPage', on: false},
    {page: 'schoolsPage', on: false},
    {page: 'submitPage', on: false}
  ]
  pagesSubscription = new Subscription;
  activePage = this.findActivePage().page;
  displayedALT = 1;
  displayedSchl = 1;
  altNames = [];
  users = [];
  show = [];

  constructor(private authService: AuthService,
              private dataStorageService: DataStorageService) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'schoolsysPage': new FormGroup({
        'username': new FormControl(null, Validators.required),
        'schoolsys': new FormControl(null, Validators.required),
        'password': new FormControl(null, Validators.required),
        'reenterpw': new FormControl(null, Validators.required)
      }),
      'altPage': new FormGroup({
        'alts': new FormArray([
          new FormGroup({
            'name': new FormControl(null, Validators.required),
            'altpw': new FormControl(null, Validators.required),
            'reenteraltpw': new FormControl(null, Validators.required)
          })
        ])
      }),
      'schoolsPage': new FormGroup({
        'schools': new FormArray([
          new FormGroup({
            'schlname': new FormControl(null, Validators.required),
            'schlnamekanji': new FormControl(null, Validators.required),
            'schlpw': new FormControl(null, Validators.required),
            'reenterschlpw': new FormControl(null, Validators.required),
            'associatedALT': new FormControl(null, Validators.required)
          })
        ])
      })
    });

    this.pagesSubscription = this.onPagesChange.subscribe(
      (newPages: any[]) => {
        this.pages = newPages;
        this.activePage = this.findActivePage().page;
      }
    )
  }

  ngOnDestroy(){
    this.pagesSubscription.unsubscribe();
  }

  preventSpaces(event){
    var k = event.which || event.keyCode;
    if (k == 32) return false;
  }

  findActivePage(){
    const activePage = this.pages.find((v,i) => {return v["on"] == true});
    return activePage;
  }

  onNext(){
    const password = this.signupForm.get('schoolsysPage.password').value;
    const reenteredpw = this.signupForm.get('schoolsysPage.reenterpw').value;
    if (password != reenteredpw){
      alert('The entered passwords are not equal.')
    }
    else if (!this.signupForm.get('schoolsysPage').valid){
      alert('Please fill out the required fields.')
    }
    else{
      const schoolsys = this.signupForm.get('schoolsysPage.schoolsys').value + '.jp';
      const username = this.signupForm.get('schoolsysPage.username').value + '-main@' + schoolsys;
      firebase.auth().fetchProvidersForEmail(username)
        .then(
          (response: string[]) => {
            if (response.length == 0){
              const pagesCopy = this.pages.slice();
              const index = pagesCopy.indexOf(this.findActivePage());
              pagesCopy[index].on = false;
              pagesCopy[index+1].on = true;
              this.onPagesChange.next(pagesCopy);
            }
            else {
              alert('That email address is not available.');
            }
          }
        )
    }
  }

  addALT(){
    (<FormArray>this.signupForm.get('altPage.alts')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'altpw': new FormControl(null, Validators.required),
        'reenteraltpw': new FormControl(null, Validators.required)
    }));
    this.displayedALT = this.displayedALT+1;
  }

  deleteALT(index: number){
    (<FormArray>this.signupForm.get('altPage.alts')).removeAt(index);
    this.displayedALT = this.displayedALT-1;
  }

  prevActiveALT(){
    if (this.displayedALT == 1) {return false;}
    else {this.displayedALT = this.displayedALT-1;}
  }

  nextActiveALT(){
    const length = (<FormArray>this.signupForm.get('altPage.alts')).length;
    if (this.displayedALT == length) {return false;}
    else {this.displayedALT = this.displayedALT+1;}
  }

  onNextALT(){
    let canContinue = false;
    const schoolsys = this.signupForm.get('schoolsysPage.schoolsys').value + '.jp';
    const length = (<FormArray>this.signupForm.get('altPage.alts')).length;
    for (let i = 0; i < length; i++){
      const pw = (<FormArray>this.signupForm.get('altPage.alts')).at(i).get('altpw').value
      const reenteredpw = (<FormArray>this.signupForm.get('altPage.alts')).at(i).get('reenteraltpw').value
      const name = (<FormArray>this.signupForm.get('altPage.alts')).at(i).get('name').value;
      if (pw != reenteredpw){
        alert('The entered passwords are not equal for: ' + name)
        canContinue = false;
      }
      else{
        canContinue = true;
      }
    }

    if (canContinue){
      if (!this.signupForm.get('altPage').valid){
        alert('Please fill out the required fields.')
      }
      else{
        let promises = [];

        for (let i = 0; i < length; i++){
          const altEmail = (<FormArray>this.signupForm.get('altPage.alts')).at(i).get('name').value +
            '-alt@' + schoolsys;
          promises.push(firebase.auth().fetchProvidersForEmail(altEmail)
            .then(
              (response: string[]) => {
                if (response.length != 0) {
                  alert('The email address \'' + altEmail + '\' is not available.');
                  canContinue = false;
                }
              }
            )
          )
        }

        Promise.all(promises)
        .then(
          () => {
            if (canContinue){
              const pagesCopy = this.pages.slice();
              const index = pagesCopy.indexOf(this.findActivePage());
              pagesCopy[index].on = false;
              pagesCopy[index+1].on = true;
              this.onPagesChange.next(pagesCopy);
            
              for (let i = 0; i < length; i++){
                this.altNames.splice(i, 1, (<FormArray>this.signupForm.get('altPage.alts')).at(i).get('name').value)
              }
            }
          }
        )
      }
    }
  }

  onBack(){
    const pagesCopy = this.pages.slice();
    const index = pagesCopy.indexOf(this.findActivePage());
    pagesCopy[index].on = false;
    pagesCopy[index-1].on = true;
    this.onPagesChange.next(pagesCopy);
  }

  addSchool(){
    (<FormArray>this.signupForm.get('schoolsPage.schools')).push(
      new FormGroup({
        'schlname': new FormControl(null, Validators.required),
        'schlnamekanji': new FormControl(null, Validators.required),
        'schlpw': new FormControl(null, Validators.required),
        'reenterschlpw': new FormControl(null, Validators.required),
        'associatedALT': new FormControl(null, Validators.required)
    }));
    this.displayedSchl = this.displayedSchl+1;
  }

  deleteSchl(index: number){
    (<FormArray>this.signupForm.get('schoolsPage.schools')).removeAt(index);
    this.displayedSchl = this.displayedSchl-1;
  }

  prevActiveSchl(){
    if (this.displayedSchl == 1) {return false;}
    else {this.displayedSchl = this.displayedSchl-1;}
  }

  nextActiveSchl(){
    const length = (<FormArray>this.signupForm.get('schoolsPage.schools')).length;
    if (this.displayedSchl == length) {return false;}
    else {this.displayedSchl = this.displayedSchl+1;}
  }

  onNextSchl(){
    let canContinue = false;
    const schoolsys = this.signupForm.get('schoolsysPage.schoolsys').value + '.jp';
    const length = (<FormArray>this.signupForm.get('schoolsPage.schools')).length;
    for (let i = 0; i < length; i++){
      const schlpw = (<FormArray>this.signupForm.get('schoolsPage.schools')).at(i).get('schlpw').value
      const reenteredschlpw = (<FormArray>this.signupForm.get('schoolsPage.schools')).at(i).get('reenterschlpw').value
      const name = (<FormArray>this.signupForm.get('schoolsPage.schools')).at(i).get('schlname').value;
      if (schlpw != reenteredschlpw){
        alert('The entered passwords are not equal for: ' + name)
        canContinue = false;
      }
      else{
        canContinue = true;
      }
    }

    if (canContinue){
      if (!this.signupForm.get('schoolsPage').valid){
        alert('Please fill out the required fields.')
      }
      else{
        let promises = [];

        for (let i = 0; i < length; i++){
          const schlEmail = (<FormArray>this.signupForm.get('schoolsPage.schools')).at(i).get('schlname').value +
            '-school@' + schoolsys;
          promises.push(firebase.auth().fetchProvidersForEmail(schlEmail)
            .then(
              (response: string[]) => {
                if (response.length != 0) {
                  alert('The email address \'' + schlEmail + '\' is not available.');
                  canContinue = false;
                }
              }
            )
          )
        }

        Promise.all(promises)
        .then(
          () => {
            if (canContinue){
              const pagesCopy = this.pages.slice();
              const index = pagesCopy.indexOf(this.findActivePage());
              pagesCopy[index].on = false;
              pagesCopy[index+1].on = true;
              this.onPagesChange.next(pagesCopy);

              let usersArray = [];
              const schoolsys = this.signupForm.get('schoolsysPage.schoolsys').value + '.jp';
          
              usersArray.push({
                type: 'main',
                email: this.signupForm.get('schoolsysPage.username').value + '-main@' + schoolsys,
                password: this.signupForm.get('schoolsysPage.password').value
              });
          
              const altlength = (<FormArray>this.signupForm.get('altPage.alts')).length;
              for (let i = 0; i < altlength; i++){
                usersArray.push({
                  type: 'alt',
                  email: (<FormArray>this.signupForm.get('altPage.alts')).at(i).get('name').value + '-alt@' + schoolsys,
                  password: (<FormArray>this.signupForm.get('altPage.alts')).at(i).get('altpw').value
                })
              }
          
              const schllength = (<FormArray>this.signupForm.get('schoolsPage.schools')).length;
              for (let i = 0; i < schllength; i++){
                usersArray.push({
                  type: 'school',
                  email: (<FormArray>this.signupForm.get('schoolsPage.schools')).at(i).get('schlname').value +
                    '-school@' + schoolsys,
                  password: (<FormArray>this.signupForm.get('schoolsPage.schools')).at(i).get('schlpw').value,
                  associatedALT: (<FormArray>this.signupForm.get('schoolsPage.schools')).at(i).get('associatedALT').value
                })
              }
              this.users = usersArray;
            }
          }
        )
      }
    }
  }

  showPW(index: number){
    this.show.push(index)
  }

  onSubmit(){
    //sign up the emails
    for (let user of this.users){
      // this.authService.signupUser(user.email, user.password);
      console.log(user.email + user.password);
    }

    //make schoolsys data folder

    //make alt list

    //make schoolslist
  }

}
