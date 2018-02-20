import { DataStorageService } from './../../shared/data-storage.service';
import { SchoolPair } from './../../shared/schoolpair.model';
import { School } from './../../shared/school.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SchoolService } from '../../shared/school.service';
import { NgForm} from '@angular/forms';
import { TimeService } from '../../shared/time.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../auth/auth.service';

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
  timeSubscription: Subscription;

  weekend = false;

  constructor(public schoolService: SchoolService,
              public dataStorageService: DataStorageService,
              public authService: AuthService,
              public timeService: TimeService,
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
  }

  ngOnDestroy(){
    if (this.timeSubscription){
      this.timeSubscription.unsubscribe();
    }
  }

  onSave(){
    const nameInp = this.editForm.value.name;
    const yearInp = this.editForm.value.year;
    const monthInp = this.editForm.value.month;
    const dateInp = this.editForm.value.date;
    const timeInp = this.editForm.value.time;
    let targetSchool = this.schoolService.findSchoolFiltered(yearInp, monthInp, dateInp, timeInp);
    let allDaySchool = this.schoolService.findSchoolFiltered(yearInp, monthInp, dateInp, '一日中');
    let morningSchool = this.schoolService.findSchoolFiltered(yearInp, monthInp, dateInp, '午前');
    let noonSchool = this.schoolService.findSchoolFiltered(yearInp, monthInp, dateInp, '午後');
    
    if (targetSchool && this.schoolService.getIndexFiltered(targetSchool) != this.id){
      alert('Another school already exists on that time & date.');
    }
    else if (allDaySchool){
      alert('Another school already exists on that time & date.');
    }
    else if (timeInp == '一日中' &&  morningSchool && this.schoolService.getIndexFiltered(morningSchool) != this.id){
      alert('Another school already exists on that time & date.');
    }
    else if (timeInp == '一日中' &&  noonSchool && this.schoolService.getIndexFiltered(noonSchool) !=this.id){
      alert('Another school already exists on that time & date.');
    }
    else{
      let editedSchool = new School(this.editForm.value.name, yearInp, monthInp, dateInp, timeInp,
        this.schoolService.activeUser);
      const token = this.authService.token;
      this.dataStorageService.addToSchoolDispList(editedSchool, token)
        .subscribe(
          (response) => console.log(response),
          (error) => { throw error },
          () => {
            this.schoolService.editSchool(this.id, editedSchool);
            this.schoolService.filterSchoolsByUser();
          }
        );
      this.router.navigate(['schedule']);
    }
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
