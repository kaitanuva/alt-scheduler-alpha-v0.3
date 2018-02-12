import { DataStorageService } from './data-storage.service';
import { Injectable } from '@angular/core';
import { SchoolPair } from './schoolpair.model';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from "rxjs/Subject";
import { School } from './school.model';
import { SchoolPlan } from './schoolplan.model';

@Injectable()

export class SchoolService{

  dateChanged = new Subject<{year: number, month: number}>();
  altListChanged = new Subject<string[]>();
  schoolsListChanged = new Subject<SchoolPair[]>();
  approvalListChanged = new Subject<SchoolPlan[]>();
  planCounterUpdated = new Subject<number[]>();
  deleteSchoolOn = new Subject<boolean>();
  schoolSys: string;
  activeUser: string;
  loggedInSchool: string;
  loggedInSchoolIndex: number;
  selectedSchool: string;
  selectedSchoolIndex: number;

  private schools = [];

  private filteredSchools = [];

  private schoolsList = [];

  private approvalList = [];

  private schoolPlans = [];

  private altList = [];

  constructor(){}

  ////////~~~Alt Functions~~~////////

  setAltList(altList: string[]){
    this.altList = altList;
    this.altListChanged.next(altList);
  }

  getAltList(){
    return this.altList.slice();
  }

  deleteFromAltList(alt: string){
    const id = this.altList.indexOf(alt);
    this.altList.splice(id, 1);
    this.altListChanged.next(this.altList.slice());
  }

  addToALTList(alt: string){
    this.altList.push(alt);
    this.altListChanged.next(this.altList.slice());
  }

  checkIfALTAlreadyExists(alt: string){
    const found = this.altList.indexOf(alt);
    return found == -1 ? false : true;
  }

  ////////school functions/////////

  setSchools(schools: School[]){
    this.schools = schools;
  }

  getSchools(){
    return this.schools.slice();
  }

  getfilteredSchools(){
    return this.filteredSchools.slice();
  }

  getSchool(id: number){
    return this.schools[id];
  }

  filterSchoolsByUser(){
    let newSchools = [];
    newSchools.push.apply(newSchools, this.schools.filter((v,i) => {
      return (v["alt"] == this.activeUser);
    }));
    this.filteredSchools = newSchools;
  }

  editSchool(id: number, editedSchool: School){
    this.schools[id] = editedSchool;
  }

  addSchool(school: School){
    this.schools.push(school);
  }

  deleteSchool(id: number){
    this.schools.splice(id, 1);
  }

  getIndex(school: School){
    let index = this.schools.indexOf(school);
    return index;
  }

  getIndexFiltered(school: School){
    let index = this.filteredSchools.indexOf(school);
    return index;
  }

  deleteNewSchool(){
    let newSchool = this.schools.find(function(v,i){
      return (v["name"] == 'New School')
    })
    if (newSchool){
      this.schools.splice(this.getIndex(newSchool), 1);
    }
  }

  findSchoolFiltered(year: number, month: number, date: number, time: string){
    let school = this.filteredSchools.find(function(v,i){
      return (v["year"] == year && v["month"] == month && v["date"] == date && v["time"] == time);
    })
    return school;
  }

  isAllDaySchool(year: number, month: number, date: number){
    if (this.findSchoolFiltered(year, month, date, '一日中')){
      return true;
    }
    else{
      return false;
    }
  }

  //////////////////////////////////////

  ////////schoollist & schoolplans functions/////////

  setSchoolsList(newschoolsList: SchoolPair[]){
    this.schoolsList = newschoolsList;
    this.schoolsListChanged.next(newschoolsList);
  }

  getSchoolsList(){
    return this.schoolsList.slice();
  }

  getSchoolPlansCopy(){
    return this.schoolPlans.slice();
  }

  getSchoolFromSchoolList(id: number){
    return this.schoolsList[id].school;
  }

  getSchoolNameUsingLoggedIn(){
    const school = this.schoolsList.find((v,i) => {return (v["id"] == this.loggedInSchool)})
    return school.school;
  }

  getIDFromSchoolList(schoolName: string){
    const school = this.schoolsList.find(function(v,i){
      return (v["school"] == schoolName)
    })
    return this.schoolsList.indexOf(school);
  }

  getIDFromSchoolListbyRomaji(schoolID: string){
    const school = this.schoolsList.find((v,i)=>{
      return (v["id"] == schoolID)
    })
    return this.schoolsList.indexOf(school)
  }

  checkIfSchoolAlreadyExists(schoolName: string){
    let found = this.schoolsList.find(function(v,i){
      return (v["school"] == schoolName)
    })
    return found ? true : false;
  }

  addToSchoolList(school: SchoolPair){
    this.schoolsList.push(school);
    this.schoolsListChanged.next(this.getSchoolsList());
  }

  deleteFromSchoolList(id:number){
    this.schoolsList.splice(id, 1);
    this.schoolsListChanged.next(this.getSchoolsList());
  }

  getSchoolPlansUsingID(id: number, year: number, month: number){
    const schoolName = this.schoolsList[id].school;
    let schoolPlansFound = this.findSchoolPlans(schoolName, year, month);
    return schoolPlansFound;
  }

  getSchoolPlanUsingName(name: string, year: number, month: number, date: number){
    let schoolPlan = this.schoolPlans.find(function(v,i){
      return (v["name"] == name && v["year"] == year && v["month"] == month
      && v["date"] == date)
    })
    return schoolPlan;
  }

  findSchoolPlans(name: string, year: number, month: number){
    let schools = this.schoolPlans.filter(function(v,i){
      return (v["name"] == name && v["year"] == year && v["month"] == month)
    })
    return schools;
  }

  checkSchoolPlansByDate(year: number, month: number, date: number){
    let schoolPlan = this.schoolPlans.find(function(v,i){
      return (v["year"] == year && v["month"] == month && v["date"] == date)
    })
    return schoolPlan;
  }

  addToSchoolPlans(schoolPlan: SchoolPlan){
    this.schoolPlans.push(schoolPlan);
  }

  editSchoolPlan(schoolPlan: SchoolPlan, newSchoolPlan: SchoolPlan){
    const index = this.schoolPlans.indexOf(schoolPlan);
    this.schoolPlans[index] = newSchoolPlan;
  }

  deleteSchoolPlan(schoolPlan: SchoolPlan){
    const index = this.schoolPlans.indexOf(schoolPlan);
    this.schoolPlans.splice(index, 1);
  }

  sortPlansByDate(schoolPlans: SchoolPlan[]){
    const newSchoolPlans = schoolPlans.sort(function(a,b){
      return a.date - b.date;
    });
    return newSchoolPlans;
  }

  setSchoolPlans(schoolPlans: SchoolPlan[]){
    this.schoolPlans = schoolPlans;
  }

  ////////////////////////////

  //~~~~~~~Approval List Functions~~~~~~~~~~//

  getApprovalList(){
    return this.approvalList.slice();
  }

  setApprovalList(schoolPlans: SchoolPlan[]){
    this.approvalList = schoolPlans;
  }

  removeFromApprovalList(id: number){
    this.approvalList.splice(id, 1);
    this.approvalListChanged.next(this.getApprovalList());
  }
}