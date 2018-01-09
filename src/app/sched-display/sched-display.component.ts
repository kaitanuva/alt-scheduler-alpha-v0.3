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
  activeUser: string;
  theDate = new Date();
  months = ['1月', '2月', '3月', '4月', '5月', '6月',
   '7月', '8月', '9月', '10月', '11月', '12月'];
  currentMonth = this.theDate.getMonth();
  currentYear = this.theDate.getFullYear();
  lastDate = this.retrieveLastDate();
  datesList = [];
  approvalList: SchoolPlan[];
  timeSubscription: Subscription;
  approvalListSubscription: Subscription;

  constructor(private schoolService: SchoolService,
              private router: Router,
              private timeService: TimeService,
              private authService: AuthService) { }

  ngOnInit() {
    this.activeUser = this.schoolService.activeUser;
    this.schoolService.filterSchoolsByUser(this.activeUser);
    this.schoolService.deleteNewSchool();
    this.approvalList = this.schoolService.getApprovalList();
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

  schoolClicked(year: number, month: number, date: number, time: string){
    let foundSchool = this.findSchool(year, month, date, time);
    if (this.authService.userType == 'alt'){
      if (foundSchool){
        const id = this.schoolService.getIDFromSchoolList(foundSchool.name);
        this.router.navigate(['schools/'+id]);
        this.timeService.altClickedYear = foundSchool.year;
        this.timeService.altClickedMonth = foundSchool.month;
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
        let newSchool = new School('New School', year, month, date, time);
        this.schoolService.addSchool(newSchool);
        let index = this.schoolService.getIndex(newSchool);
        this.router.navigate(['/'+index+'/new']);
      }
    }
  }

  onAddSchool(year: number, month: number, date: number, time: string){
    let newSchool = new School('New School', year, month, date, time);
    this.schoolService.addSchool(newSchool);
    let index = this.schoolService.getIndex(newSchool);
    this.router.navigate(['/'+index+'/new']);
  }

  ngOnDestroy(){
    if (this.timeSubscription){
      this.timeSubscription.unsubscribe();
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
    const id = this.approveForm.value.requestedSchools;
    const selectedSchool = this.approvalList[id];
    const approvedSchool = new School(selectedSchool.name, selectedSchool.year,
      selectedSchool.month, selectedSchool.date, selectedSchool.time);
    if (selectedSchool.status == 'new'){
      this.schoolService.addSchool(approvedSchool);
      this.schoolService.filterSchoolsByUser(this.activeUser);
      this.schoolService.addToSchoolPlans(selectedSchool);
      this.schoolService.removeFromApprovalList(id);
    }
    else{
      const deleteSchoolID = this.schoolService.getIndex(approvedSchool);
      this.schoolService.deleteSchool(deleteSchoolID);
      this.schoolService.deleteSchoolPlan(selectedSchool);
      this.schoolService.removeFromApprovalList(id);
    }
  }

  onReject(){
    const id = this.approveForm.value.requestedSchools;
    const selectedSchool = this.approvalList[id];
    this.schoolService.removeFromApprovalList(id);
  }
}
