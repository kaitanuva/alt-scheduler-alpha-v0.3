import { SchoolPlan } from './../shared/schoolplan.model';
import { SchoolService } from './../shared/school.service';
import { DataStorageService } from './../shared/data-storage.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { RedirectService } from '../redirect/redirect.service';

@Injectable()
export class AuthService{
  token: string;
  userType: string;
  altName: string;
  schoolName: string;

  constructor(private router: Router,
              public redirectService: RedirectService,
              public dataStorageService: DataStorageService,
              public schoolService: SchoolService){}

  signinUser(username: string, password: string){
    firebase.auth().signInWithEmailAndPassword(username, password)
      .then(
        response => {
          firebase.auth().currentUser.getIdToken()
            .then(
              (token: string) => {
                this.token = token;
                this.redirectService.logout = false;
                this.redirectService.canRedirectSwitch.next(true);
                this.router.navigate(['reloading']);
                this.redirectService.redirectRoute = '';
              }
            )
        }
      )
      .catch(
        error => {
          console.log(error);
          alert('Invalid username or password');
        }
      )
  }

  getIdToken(){
    firebase.auth().currentUser.getIdToken()
      .then(
        (token: string) => this.token = token
      );
    return this.token;
  }

  logout(){
    firebase.auth().signOut();
    this.token = null;
    this.altName = null;
    this.userType = null;
    this.schoolService.activeUser = null;
    this.schoolService.loggedInSchool = null;
    this.schoolService.loggedInSchoolIndex = null;
    this.schoolService.selectedSchool = null;
    this.schoolService.selectedSchoolIndex = null;
    this.redirectService.logout = true;
    this.redirectService.canRedirectSwitch.next(true);
    this.router.navigate(['reloading']);
    this.redirectService.redirectRoute = '';
  }

  isAuthenticated(){
    return this.token != null;
  }

  authorizeEmail(email: string){
    //Set schoolsys property
    const startindex = email.indexOf('@') + 1;
    const endindex = email.indexOf('.jp');
    this.schoolService.schoolSys = email.substring(startindex, endindex);

    //RetrieveSchldsplist
    let schools = [];
    this.dataStorageService.retrieveSchoolDispList(this.token)
      .subscribe(
        (schoolDispList) => {
          if (schoolDispList){
            Object.keys(schoolDispList).forEach((key, index) => {
              let school: any;
              school = Object.values(schoolDispList)[index]
              school.key = key;
              schools.push(school);
            })
            this.schoolService.setSchools(schools);
            this.schoolService.filterSchoolsByUser();
          }
          else{
            this.schoolService.setSchools(schools);
          }
        },
        (error) => { throw error }
      );

    //RetrieveSchlplans
    let schoolPlansList = [];
    this.dataStorageService.retrieveSchoolPlans(this.token)
      .subscribe(
        (schoolPlans) => {
          if (schoolPlans){
            Object.keys(schoolPlans).forEach((key, index) => {
              let schoolPlan: any;
              schoolPlan = Object.values(schoolPlans)[index]
              schoolPlan.key = key;
              schoolPlansList.push(schoolPlan);
            })
            this.schoolService.setSchoolPlans(schoolPlansList);
          }
          else{
            this.schoolService.setSchoolPlans(schoolPlansList);
          }
        },
        (error) => { throw error }
      );

    //Set previleges
    if (email.includes('alt')){
      this.userType = 'alt';
      const index = email.indexOf('-alt');
      this.altName = email.slice(0, index);
      this.schoolService.activeUser = this.altName;

      this.dataStorageService.retrieveSchoolList(this.token)
        .subscribe(
          () => {
            this.dataStorageService.filterSchoolsList(this.altName, null);
          }
        );
    }
    else if(email.includes('school')){
      this.userType = 'school';
      const index = email.indexOf('-school');
      const schoolName = email.slice(0, index);
      this.schoolName = schoolName;
      this.schoolService.loggedInSchool = schoolName;
      this.dataStorageService.retrieveSchoolList(this.token)
        .subscribe(
          () => {
            const associatedALT = this.dataStorageService.getALTassociatedWithSchool(schoolName);
            this.schoolService.activeUser = associatedALT;
            this.dataStorageService.filterSchoolsList(null, schoolName);
          }
        );
    }
    else{
      this.userType = 'main';
      this.dataStorageService.retrieveAltList(this.token)
        .subscribe(
          (altList) => {
            if (altList){
              this.altName = Object.values(altList)[0][0];
              this.schoolService.activeUser = this.altName;
              let theAltList = [];
              const altListObj = Object.values(altList)[0];
              Object.values(altListObj).forEach((v,i) => {
                theAltList.push(v);
              })
              this.schoolService.setAltList(theAltList);
            }
            else {
              this.schoolService.setAltList([]);
            }
          }
        );
      this.dataStorageService.retrieveSchoolList(this.token)
        .subscribe(
          () => {
            this.dataStorageService.filterSchoolsList(null, null);
          }
        );
    }
    this.schoolService.filterSchoolsByUser();
  }
}