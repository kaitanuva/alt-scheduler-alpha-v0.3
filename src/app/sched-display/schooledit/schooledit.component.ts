import { AuthService } from './../../auth/auth.service';
import { DataStorageService } from './../../shared/data-storage.service';
import { SchoolPair } from './../../shared/schoolpair.model';
import { School } from './../../shared/school.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SchoolService } from '../../shared/school.service';
import { NgForm} from '@angular/forms';
import { TimeService } from '../../shared/time.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-schooledit',
  templateUrl: './schooledit.component.html',
  styleUrls: ['./schooledit.component.css']
})
export class SchooleditComponent implements OnInit, OnDestroy{
  @ViewChild('f') editForm: NgForm;
  id: number;
  name: string;
  year: number;
  month: number;
  date: number;
  time: string;
  key: string;
  theDate = new Date();
  lastDate: number;
  datesList = [];
  timeSubscription: Subscription;
  schoolSubscription: Subscription;

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
    this.key = school.key;

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
    let editedSchool = new School(this.editForm.value.name, this.year, this.month, this.date, this.time,
      this.schoolService.activeUser);
    const token = this.authService.token;
    this.dataStorageService.editSchoolDisp(this.key, token, editedSchool)
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

  onDelete(){
    const school = this.schoolService.getSchool(this.id);
    const schoolPlan = this.schoolService.getSchoolPlanUsingName(school.name, school.year,
      school.month, school.date); 
    if (confirm('Are you sure you want to delete this school? :'
     + school.name + ' ' + school.year + '/' + school.month + '/' + school.date)){
      this.dataStorageService.removeFromDispList(school.key, this.authService.token)
        .subscribe(
          (response) => console.log(response),
          (error) => { throw error },
          () => {
            this.schoolService.deleteSchool(this.id);
            this.schoolService.filterSchoolsByUser();
          }
        );
      this.dataStorageService.removeFromSchoolPlans(schoolPlan.key, this.authService.token)
        .subscribe(
          (response) => console.log(response),
          (error) => console.log(error),
          () => {
            this.schoolService.deleteSchoolPlan(schoolPlan);
            this.schoolService.filterSchoolsByUser();
          }
        );
      this.router.navigate(['schedule']);
    }
    else{
      return;
    }
  }
}
