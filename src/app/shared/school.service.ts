import { Injectable } from '@angular/core';
import { SchoolPair } from './schoolpair.model';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from "rxjs/Subject";
import { School } from './school.model';
import { SchoolPlan } from './schoolplan.model';

@Injectable()

export class SchoolService{

  dateChanged = new Subject<{year: number, month: number}>();
  schoolsListChanged = new Subject<SchoolPair[]>();
  approvalListChanged = new Subject<School[]>();
  planCounterUpdated = new Subject<number[]>();
  deleteSchoolOn = new Subject<boolean>();
  activeUser: string;
  loggedInSchool: string;
  loggedInSchoolIndex: number;
  selectedSchool: string;
  selectedSchoolIndex: number;

  private schools = [
    new School('坊津学園', 2017, 12, 1, '午前'),
    new School('長屋小', 2017, 12, 1, '午後'),
    new School('金峰中', 2017, 12, 5, '一日中'),
    new School('長屋小', 2018, 1, 11, '午後'),
    new School('加世田小', 2017, 12, 4, '午前')
  ];

  private filteredSchools = [];

  private schoolsList = [];

  private approvalList = [];

  private schoolPlans = [];

  constructor(){}

  ////////school functions/////////

  getSchools(){
    return this.schools.slice();
  }

  getfilteredSchools(){
    return this.filteredSchools.slice();
  }

  getSchool(id: number){
    return this.schools[id];
  }

  filterSchoolsByUser(user: string){
    let filteredByName = this.schoolsList.filter(function(v,i){
      return (v["alt"] == user)
    })
    let newSchools = [];
    for (let school of filteredByName){
      newSchools.push.apply(newSchools, this.schools.filter(function(v,i){
        return (v["name"] == school.school)
      }))
    }
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

  checkIfAlreadyExists(schoolName: string){
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

  removeFromApprovalList(id: number){
    this.approvalList.splice(id, 1);
    this.approvalListChanged.next(this.getApprovalList());
  }
}