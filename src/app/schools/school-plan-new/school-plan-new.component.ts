import { DataStorageService } from './../../shared/data-storage.service';
import { NgForm } from '@angular/forms';
import { TimeService } from './../../shared/time.service';
import { SchoolService } from './../../shared/school.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SchoolPlan } from '../../shared/schoolplan.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-school-plan-new',
  templateUrl: './school-plan-new.component.html',
  styleUrls: ['./school-plan-new.component.css']
})
export class SchoolPlanNewComponent implements OnInit {
  @ViewChild('f') planForm: NgForm;
  theDate = new Date();
  months = ['1月', '2月', '3月', '4月', '5月', '6月',
   '7月', '8月', '9月', '10月', '11月', '12月'];
  currentMonth: number;
  currentYear: number;
  schoolName: string;
  lastDate: number;
  datesList = [];
  theDay = '曜日';
  daySubscription: Subscription;
  weekend = false;

  constructor(private route: ActivatedRoute,
              private schoolService: SchoolService,
              private timeService: TimeService,
              private dataStorageService: DataStorageService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.schoolName = this.schoolService.selectedSchool;
    this.currentMonth = this.timeService.selectedMonth;
    this.currentYear = this.timeService.selectedYear;

    this.lastDate = this.timeService.getLastDate(this.currentYear, this.currentMonth);
    for (let i = 1; i <= this.lastDate; i++){
      this.datesList.push(i);
    }

    this.daySubscription = this.timeService.dayChanged.subscribe(
      (date: number) => {
        let newDay = this.getTheDay(date);
        this.theDay = newDay;
      }
    )
  }

  ngOnDestroy(){
    if (this.daySubscription){
      this.daySubscription.unsubscribe();
    }
  }

  onRequest(){
    const form = this.planForm.value;
    const schoolName = this.schoolService.selectedSchool;
    let schoolPlan = new SchoolPlan(schoolName, this.currentYear, this.currentMonth+1, 
      form.date, this.theDay, form.period1, form.period2, form.period3, form.period4,
      form.period5, form.period6, form.class1, form.class2, form.class3, form.class4,
      form.class5, form.class6, form.teacher1, form.teacher2, form.teacher3, 
      form.teacher4, form.teacher5, form.teacher6, form.lesson1, form.lesson2, 
      form.lesson3, form.lesson4, form.lesson5, form.lesson6, form.lunch, 
      form.classLunch, form.teacherLunch);
    const token = this.authService.getIdToken();
    this.dataStorageService.addToApprovalList('new', form.time, schoolPlan, token)
      .subscribe(
        (response) => console.log(response),
        (error) => console.log(error)
      );
    this.schoolService.selectedSchoolIndex = this.schoolService.loggedInSchoolIndex;
    this.router.navigate(['./../'], {relativeTo: this.route});
  }

  onCancel(){
    this.schoolService.selectedSchoolIndex = this.schoolService.loggedInSchoolIndex;
    this.router.navigate(['./../'], {relativeTo: this.route});
  }

  onChangeDate(){
    this.weekend = this.timeService.isWeekend(this.currentYear, this.currentMonth, 
                               this.planForm.value.date);
    this.timeService.dayChanged.next(this.planForm.value.date);
  }

  getTheDay(date: number){
    return this.timeService.getDay(this.currentYear, this.currentMonth, date);
  }

}
