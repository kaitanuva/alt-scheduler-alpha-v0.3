import { DataStorageService } from './../shared/data-storage.service';
import { SchoolPlan } from './../shared/schoolplan.model';
import { NgForm } from '@angular/forms';
import { School } from './../shared/school.model';
import { SchoolService } from './../shared/school.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DateDay } from './dateday.model';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { TimeService } from '../shared/time.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sched-display',
  templateUrl: './sched-display.component.html',
  styleUrls: ['./sched-display.component.css']
})
export class SchedDisplayComponent implements OnInit, OnDestroy {
  @ViewChild('f') approveForm: NgForm;
  theDate = new Date();
  months = ['1月', '2月', '3月', '4月', '5月', '6月',
   '7月', '8月', '9月', '10月', '11月', '12月'];
  currentMonth = this.theDate.getMonth();
  currentYear = this.theDate.getFullYear();
  lastDate = this.retrieveLastDate();
  greyedOut = false;
  greyedOutRj = false;
  datesList = [];
  activeUser: string;
  approvalList: SchoolPlan[];
  timeSubscription: Subscription;
  approvalListSubscription: Subscription;
  altListSubscription: Subscription;

  constructor(public schoolService: SchoolService,
              public dataStorageService: DataStorageService,
              private router: Router,
              public timeService: TimeService,
              public authService: AuthService) { }

  ngOnInit() {
    this.activeUser = this.schoolService.activeUser;
    this.schoolService.filterSchoolsByUser();
    this.schoolService.deleteNewSchool();
    if (this.authService.userType == 'main'){
      let schoolPlansList = [];
      let filteredList = [];
      this.dataStorageService.retrieveApprovalList(this.authService.token)
        .subscribe(
          (schoolPlans) => {
            if (schoolPlans){
              Object.keys(schoolPlans).forEach((key,index)=>{
                let schoolPlan: any;
                schoolPlan = Object.values(schoolPlans)[index];
                schoolPlan.key = key;
                schoolPlansList.push(schoolPlan);
              })
              filteredList = schoolPlansList.filter((v,i) => {
                return (v["alt"] == this.schoolService.activeUser);
              });
              this.schoolService.setApprovalList(filteredList);
              this.approvalList = this.schoolService.getApprovalList();
            }
          },
          (error) => console.log(error)
        );
    }
    if (this.authService.userType == 'school' && !this.schoolService.activeUser){
      this.router.navigate(['']);
    }
    for (let i = 1; i <= this.lastDate; i++){
      this.datesList.push(new DateDay(i, this.getTheDay(i)));
    }
    this.timeSubscription = this.timeService.dateChanged
      .subscribe(
        (yearMonth: {year: number, month: number}) => {
          this.currentMonth = yearMonth.month;
          this.currentYear = yearMonth.year;
          this.lastDate = this.retrieveLastDate();
          let newDatesList = [];
          for (let i = 1; i <= this.lastDate; i++){
            newDatesList.push(new DateDay(i, this.getTheDay(i)));
          }
          this.datesList = newDatesList;
        }
      );
    this.altListSubscription = this.schoolService.altListChanged
      .subscribe(
        (altList: string[]) => {
          this.activeUser = altList[0];
          this.schoolService.filterSchoolsByUser();
        }
      )
    this.approvalListSubscription = this.schoolService.approvalListChanged
      .subscribe(
        (newApprovalList: SchoolPlan[]) => {
          this.approvalList = newApprovalList;
        }
      )
  }

  findSchool(year: number, month: number, date: number, time: string){
    return this.schoolService.findSchoolFiltered(year, month, date, time);
  }

  checkAllDaySchool(year: number, month: number, date: number){
    return this.schoolService.isAllDaySchool(year, month, date);
  }

  isHoliday(year: number, month: number, date: number){
    return this.schoolService.isHoliday(year, month, date);
  }

  schoolClicked(year: number, month: number, date: number, time: string){
    let foundSchool = this.findSchool(year, month, date, time);
    if (this.authService.userType == 'alt'){
      if (foundSchool){
        switch (foundSchool.name){
          case 'Office':
            break;
          case '勤務不可日':
            break;
          case '祝日':
            break;
          default:
            const id = this.schoolService.getIDFromSchoolList(foundSchool.name);
            this.router.navigate(['schools/'+id]);
            this.timeService.altClickedYear = foundSchool.year;
            this.timeService.altClickedMonth = foundSchool.month;
        }
      }
    }
    else if (this.authService.userType == 'school'){
      return;
    }
    else{
      if (foundSchool){
        let index = this.schoolService.getIndex(foundSchool);
        this.router.navigate(['/'+index+'/edit']);
      }
      else{
        let newSchool = new School('New School', year, month, date, time, null);
        this.schoolService.addSchool(newSchool);
        let index = this.schoolService.getIndex(newSchool);
        this.router.navigate(['/'+index+'/new']);
      }
    }
  }

  onAddSchool(year: number, month: number, date: number, time: string){
    let newSchool = new School('New School', year, month, date, time, this.activeUser);
    this.schoolService.addSchool(newSchool);
    let index = this.schoolService.getIndex(newSchool);
    this.router.navigate(['/'+index+'/new']);
  }

  ngOnDestroy(){
    if (this.timeSubscription){
      this.timeSubscription.unsubscribe();
    }
    else if (this.altListSubscription){
      this.altListSubscription.unsubscribe();
    }
  }

  nextMonth(){
    this.timeService.getNextMonth(this.currentYear, this.currentMonth);
  }

  prevMonth(){
    this.timeService.getPrevMonth(this.currentYear, this.currentMonth);
  }
  
  retrieveLastDate(){
    return this.timeService.getLastDate(this.currentYear, this.currentMonth);
  }

  getTheDay(date: number){
    let theDay = this.timeService.getDay(this.currentYear, this.currentMonth, date);
    return theDay;
  }

  onApprove(){
    this.greyedOut = true;
    setTimeout(()=>{this.greyedOut = false}, 1000);
    const id = this.approveForm.value.requestedSchools;
    if (!id) return;
    const token = this.authService.getIdToken();
    const selectedSchool = this.approvalList[id];
    console.log(selectedSchool)
    const approveSchool = new School(selectedSchool.name, selectedSchool.year,
      selectedSchool.month, selectedSchool.date, selectedSchool.time, selectedSchool.alt);

    const year = selectedSchool.year;
    const month = selectedSchool.month;
    const date = selectedSchool.date;
    let allDaySchool = this.schoolService.findSchoolFiltered(year, month, date, '一日中');
    let morningSchool = this.schoolService.findSchoolFiltered(year, month, date, '午前');
    let noonSchool = this.schoolService.findSchoolFiltered(year, month, date, '午後');

    if (selectedSchool.status == 'new'){
      if (allDaySchool){
        alert('Another school already exists on that time & date.');
      }
      else if (morningSchool && selectedSchool.time == '午前'){
        alert('Another school already exists on that time & date.');
      }
      else if (noonSchool && selectedSchool.time == '午後'){
        alert('Another school already exists on that time & date.');
      }
      else{
        this.schoolService.addSchool(approveSchool);
        this.dataStorageService.addToSchoolDispList(approveSchool, token)
          .subscribe(
            (response) => console.log(response),
            (error) => console.log(error),
            () => this.schoolService.filterSchoolsByUser()
          );
        this.schoolService.addToSchoolPlans(selectedSchool);
        this.dataStorageService.addToSchoolPlans(selectedSchool, token)
          .subscribe(
            (response) => console.log(response),
            (error) => console.log(error)
          );
        this.dataStorageService.removeFromApprovalList(selectedSchool.key, token)
          .subscribe(
            (response) => console.log(response),
            (error) => console.log(error),
            () => this.schoolService.removeFromApprovalList(id)
          );
      }
    }
    else{
      const deleteSchoolID = this.schoolService.getIndex(approveSchool);
      this.dataStorageService.removeFromDispList(selectedSchool.deleteSchoolKey, token)
        .subscribe(
          (response) => console.log(response),
          (error) => console.log(error),
          () => {
            this.schoolService.deleteSchool(deleteSchoolID);
            this.schoolService.filterSchoolsByUser();
          }
        );
      this.dataStorageService.removeFromSchoolPlans(selectedSchool.deleteSchoolPlanKey, token)
        .subscribe(
          (response) => console.log(response),
          (error) => console.log(error),
          () => {
            this.schoolService.deleteSchoolPlan(selectedSchool);
            this.schoolService.filterSchoolsByUser();
          }
        );
      this.dataStorageService.removeFromApprovalList(selectedSchool.key, token)
        .subscribe(
          (response) => console.log(response),
          (error) => console.log(error),
          () => this.schoolService.removeFromApprovalList(id)
        );
    }
  }

  onReject(){
    this.greyedOutRj = true;
    setTimeout(()=>{this.greyedOutRj = false}, 1000);
    const id = this.approveForm.value.requestedSchools;
    if (!id) return;
    const selectedSchool = this.approvalList[id];
    const token = this.authService.getIdToken();
    this.dataStorageService.removeFromApprovalList(selectedSchool.key, token)
    .subscribe(
      (response) => console.log(response),
      (error) => console.log(error),
      () => this.schoolService.removeFromApprovalList(id)
    );
  }
}
