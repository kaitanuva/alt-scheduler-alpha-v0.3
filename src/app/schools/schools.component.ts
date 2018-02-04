import { SchoolPair } from './../shared/schoolpair.model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SchoolService } from './../shared/school.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css']
})
export class SchoolsComponent implements OnInit, OnDestroy {
  @ViewChild('f') newSchoolForm: NgForm
  schoolsList = [];
  alts = [];
  altListSubscription: Subscription;
  schoolsListSubscription: Subscription;
  deleteBtnSubscription: Subscription;
  newClicked = false;
  schoolWasClicked: boolean;
  id: number;

  constructor(private schoolService: SchoolService,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    this.alts = this.schoolService.getAltList();
    let retrievedList = this.schoolService.getSchoolsList();
    for (let school of retrievedList){
      this.schoolsList.push(school.school);
    }
    const loggedInSchool = this.schoolService.loggedInSchool;
    if (loggedInSchool){
      const index = this.schoolService.getIDFromSchoolListbyRomaji(loggedInSchool);
      this.schoolService.loggedInSchoolIndex = index;
      this.schoolService.selectedSchoolIndex = index;
      this.schoolService.selectedSchool = this.schoolService.getSchoolFromSchoolList(index);
      this.router.navigate(['./schools/'+index]);
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

    this.deleteBtnSubscription = this.schoolService.deleteSchoolOn
      .subscribe(
        (onOff: boolean) => {
          this.schoolWasClicked = onOff;
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

    if (this.deleteBtnSubscription){
      this.deleteBtnSubscription.unsubscribe();
    }

    if (this.altListSubscription){
      this.altListSubscription.unsubscribe();
    }
  }

  newSchool(){
    this.newClicked = !this.newClicked;
  }

  preventSpaces(event){
    var k = event.which || event.keyCode;
    if (k == 32) return false;
  }

  schoolClicked(index: number){
    this.schoolService.deleteSchoolOn.next(true);
    this.schoolService.selectedSchool = this.schoolService.getSchoolFromSchoolList(index);
    this.schoolService.selectedSchoolIndex = index;
    this.id = index;
  }

  deleteSchool(){
    let school = this.schoolService.getSchoolFromSchoolList(this.id);
    if(confirm('Are you sure you want to delete this school:' + school + '?')){
      this.schoolService.deleteFromSchoolList(this.id);
      this.router.navigate(['schools'])
    }
    else{
      return;
    }
  }

  onSave(){
    const name = this.newSchoolForm.value.school;
    const id = this.newSchoolForm.value.id;
    const alt = this.newSchoolForm.value.alt;
    const email = id + '-school@' + this.schoolService.schoolSys + '.jp';
    const newSchool = new SchoolPair(name, id, alt);
    // const found = this.schoolService.checkIfAlreadyExists(name);
    // if (found){
    //   alert('That school already exists.')
    // }
    // else{
      if(confirm("Are you sure you want to add the school " + "'" + name +
      "'" + " assigned to ALT '" + alt + "'?")){
        // this.schoolService.addToSchoolList(newSchool);
        console.log(email)
      }
      else{
        return;
      }
    // }
  }

}
