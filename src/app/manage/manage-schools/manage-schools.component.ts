import { DataStorageService } from './../../shared/data-storage.service';
import { NgForm } from '@angular/forms';
import { SchoolPair } from './../../shared/schoolpair.model';
import { Subscription } from 'rxjs/Subscription';
import { SchoolService } from './../../shared/school.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-manage-schools',
  templateUrl: './manage-schools.component.html',
  styleUrls: ['./manage-schools.component.css']
})
export class ManageSchoolsComponent implements OnInit, OnDestroy {
  @ViewChild('f') newSchoolForm: NgForm
  newClicked = false;
  schoolsList = [];
  alts = [];
  schoolsListSubscription: Subscription;
  altListSubscription: Subscription;

  constructor(private schoolService: SchoolService,
              private authService: AuthService,
              private dataStorageService: DataStorageService) { }

  ngOnInit() {
    let retrievedList = this.schoolService.getSchoolsList();
    this.alts = this.schoolService.getAltList();
    for (let school of retrievedList){
      this.schoolsList.push(school.school);
    }

    this.schoolsListSubscription = this.schoolService.schoolsListChanged
      .subscribe(
        (updatedSchoolList: SchoolPair[]) => {
          let newList = [];
          for (let school of updatedSchoolList){
            newList.push(school.school);
          }
          this.schoolsList = newList;
        }
      );

    this.altListSubscription = this.schoolService.altListChanged.subscribe(
      (altList: string[]) => {
        this.alts = altList;
      }
    );
  }

  ngOnDestroy(){
    if (this.schoolsListSubscription){
      this.schoolsListSubscription.unsubscribe();
    }

    if (this.altListSubscription){
      this.altListSubscription.unsubscribe();
    }
  }

  preventSpaces(event){
    var k = event.which || event.keyCode;
    if (k == 32) return false;
  }

  newSchool(){
    this.newClicked = !this.newClicked;
  }

  onSave(){
    const name = this.newSchoolForm.value.school;
    const id = this.newSchoolForm.value.id;
    const password = this.newSchoolForm.value.password;
    const reenterpw = this.newSchoolForm.value.reenterpw;
    const alt = this.newSchoolForm.value.associatedALT;
    const email = id + '-school@' + this.schoolService.schoolSys + '.jp';
    const found = this.schoolService.checkIfAlreadyExists(name);
    if (found){
      alert('That school already exists.')
    }
    else if (password != reenterpw){
      alert('The entered passwords are not equal.')
    }
    else{
      if(confirm("Are you sure you want to add the school " + "'" + name +
      "'" + " assigned to ALT '" + alt + "'?")){
        firebase.auth().fetchProvidersForEmail(email)
        .then(
          (response: string[]) => {
            if (response.length == 0){
              const token = this.authService.token;
              const schoolSys = this.schoolService.schoolSys;
              const newSchool = new SchoolPair(name, id, alt);
              this.schoolService.addToSchoolList(newSchool);
              const newSchoolList = this.schoolService.getSchoolsList()
              this.dataStorageService.addtoSchoolList(newSchoolList, schoolSys, token)
                .subscribe(
                  (response) => console.log(response),
                  (error) => console.log(error),
                  () => {
                    firebase.auth().createUserWithEmailAndPassword(email, password)
                      .then(
                        () => {
                          console.log('school successfully registered');
                          this.newSchoolForm.reset();
                          alert('School was successfully added!\n\nYour account username is: '+
                            email + '\n\nPlease save this data. この情報をメモしてください。');
                          alert('Please login again.' + 'もう一度サインインしてください。。');
                          this.authService.logout();
                        }
                      )
                      .catch(
                        (error) => {
                          console.log(error);
                          alert('There was an error in registering the email.');
                        }
                      )

                  }
                )
            }
            else {
              alert('That email address is not available.');
            }
          }
        )
      }
      else{
        return;
      }
    }
  }
}
