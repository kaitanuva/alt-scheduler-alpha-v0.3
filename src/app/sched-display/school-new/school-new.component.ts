import { SchoolPair } from './../../shared/schoolpair.model';
import { School } from './../../shared/school.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SchoolService } from '../../shared/school.service';
import { NgForm} from '@angular/forms';
import { TimeService } from '../../shared/time.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-school-new',
  templateUrl: './school-new.component.html',
  styleUrls: ['./school-new.component.css']
})
export class SchoolNewComponent implements OnInit, OnDestroy{
  @ViewChild('f') editForm: NgForm;
  id: number;
  name: string;
  year: number;
  month: number;
  date: number;
  time: string;
  theDate = new Date();
  lastDate: number;
  datesList = [];
  schoolsOptionList = [];
  timeSubscription: Subscription;
  schoolSubscription: Subscription;

  weekend = false;

  constructor(private schoolService: SchoolService,
              private timeService: TimeService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
      }
    );
    let school = this.schoolService.getSchools()[this.id];
    this.name = school.name;
    this.year = school.year;
    this.month = school.month;
    this.date = school.date;
    this.time = school.time;

    this.lastDate = this.timeService.getLastDate(school.year, school.month-1);
    for (let i = 1; i <= this.lastDate; i++){
      this.datesList.push(i);
    }

    this.timeSubscription = this.timeService.dateChanged
    .subscribe(
      (yearMonth: {year: number, month: number}) => {
        this.lastDate = this.timeService.getLastDate(yearMonth.year, yearMonth.month-1);
        let newDatesList = [];
        for (let i = 1; i <= this.lastDate; i++){
          newDatesList.push(i);
        }
        this.datesList = newDatesList;
      }
    );

        
    this.schoolsOptionList = this.schoolService.getSchoolsList();
    // this.schoolSubscription = this.schoolService.schoolsListChanged.subscribe(
    //   (schools: SchoolPair[]) => {
    //     let newList = [];
    //     for (let school of schools){
    //       newList.push(school.school);
    //     }
    //     this.schoolsOptionList = newList;
    //   }
    // );
  }

  ngOnDestroy(){
    this.timeSubscription.unsubscribe();
    // this.schoolSubscription.unsubscribe();
  }

  onSave(){
    const nameInp = this.editForm.value.name;
    const yearInp = this.editForm.value.year;
    const monthInp = this.editForm.value.month;
    const dateInp = this.editForm.value.date;
    const timeInp = this.editForm.value.time;
    let targetSchool = this.schoolService.findSchool(yearInp, monthInp, dateInp, timeInp);
    let allDaySchool = this.schoolService.findSchool(yearInp, monthInp, dateInp, '一日中');
    let morningSchool = this.schoolService.findSchool(yearInp, monthInp, dateInp, '午前');
    let noonSchool = this.schoolService.findSchool(yearInp, monthInp, dateInp, '午後');
    let editedSchool = new School(nameInp, yearInp, monthInp, dateInp, timeInp);
    
    if (targetSchool && this.schoolService.getIndex(targetSchool) != this.id){
      alert('Another school already exists on that time & date.');
    }
    else if (allDaySchool){
      alert('Another school already exists on that time & date.');
    }
    else if (timeInp == '一日中' &&  morningSchool && this.schoolService.getIndex(morningSchool) != this.id){
      alert('Another school already exists on that time & date.');
    }
    else if (timeInp == '一日中' &&  noonSchool && this.schoolService.getIndex(noonSchool) !=this.id){
      alert('Another school already exists on that time & date.');
    }
    else{
      this.schoolService.editSchool(this.id, editedSchool);
      this.router.navigate(['schedule']);
    }
    console.log(this.schoolService.getSchools());
  }

  checkWeekend(){
    this.weekend = this.timeService.isWeekend(this.editForm.value.year, this.editForm.value.month-1,
                               this.editForm.value.date);
  }

  onChangeYear(){
    let year = this.editForm.value.year;
    let month = this.editForm.value.month;
    this.timeService.dateChanged.next({year, month});
  }

  onChangeMonth(){
    let year = this.editForm.value.year;
    let month = this.editForm.value.month;
    this.timeService.dateChanged.next({year, month});
  }

}
