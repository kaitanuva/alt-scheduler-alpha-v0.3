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
  schoolsListSubscription: Subscription;
  deleteBtnSubscription: Subscription;
  newClicked = false;
  schoolWasClicked: boolean;
  id: number;

  constructor(private schoolService: SchoolService,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    let retrievedList = this.schoolService.getSchoolsList();
    const altName = this.authService.altName;
    if(altName){
      let filteredList = retrievedList.filter(function(v,i){return (v["alt"] == altName)})
      for (let school of filteredList){
        this.schoolsList.push(school.school);
      }
    }
    else if(this.authService.userType == 'school' || this.authService.userType == 'main'){
      for (let school of retrievedList){
        this.schoolsList.push(school.school);
      }
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
      )

    this.deleteBtnSubscription = this.schoolService.deleteSchoolOn
      .subscribe(
        (onOff: boolean) => {
          this.schoolWasClicked = onOff;
        }
      )
  }

  ngOnDestroy(){
    this.schoolsListSubscription.unsubscribe();
  }

  newSchool(){
    this.newClicked = !this.newClicked;
  }

  schoolClicked(index: number){
    this.schoolService.deleteSchoolOn.next(true);
    this.schoolService.selectedSchool = this.schoolService.getSchoolFromSchoolList(index);
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
    const alt = this.newSchoolForm.value.alt;
    const newSchool = new SchoolPair(name, alt);
    const found = this.schoolService.checkIfAlreadyExists(name);
    if (found){
      alert('That school already exists.')
    }
    else{
      if(confirm("Are you sure you want to add the school " + "'" + name +
      "'" + " assigned to ALT '" + alt + "?")){
        this.schoolService.addToSchoolList(newSchool);
      }
      else{
        return;
      }
    }
  }

}
