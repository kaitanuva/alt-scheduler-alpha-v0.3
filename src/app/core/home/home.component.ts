import { DataStorageService } from './../../shared/data-storage.service';
import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SchoolService } from '../../shared/school.service';
import { SchoolPlan } from './../../shared/schoolplan.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{
  @ViewChild('f') planForm: NgForm;
  theDate = new Date();
  currentMonth = this.theDate.getMonth();
  currentYear = this.theDate.getFullYear();
  currentDate = this.theDate.getDate();
  schoolPlansList = [];
  hidden = true;
  schoolPlansSubscription: Subscription;

  constructor(public schoolService: SchoolService,
              public authService: AuthService,
              public dataStorageService: DataStorageService) { }

  ngOnInit() {
    if (this.authService.userType === 'alt'){
      let filteredPlans = [];
      filteredPlans = this.schoolService.getSchoolPlansCopy().filter((v,i) => {
        return (v["year"] == this.currentYear && v["month"] == this.currentMonth+1 &&
          v["date"] == this.currentDate);
      });
      this.schoolPlansList = filteredPlans;
      this.schoolPlansSubscription = this.schoolService.schoolPlansChanged
        .subscribe(
          (schoolPlans: SchoolPlan[]) => {
            filteredPlans = schoolPlans.filter((v,i) => {
              return (v["year"] == this.currentYear && v["month"] == this.currentMonth+1 &&
                v["date"] == this.currentDate);
            });
            this.schoolPlansList = filteredPlans;
          }
        );
    }

  }

  ngOnDestroy(){
    if (this.schoolPlansSubscription) this.schoolPlansSubscription.unsubscribe();
  }

  toggleHidden(){
    this.hidden = false;
  }

  saveNotes(schoolPlan: SchoolPlan, index: number){
    const token = this.authService.token;
    const newSchoolPlan = schoolPlan;
    newSchoolPlan.altnotes = Object.values(this.planForm.value)[index];
    this.dataStorageService.editSchoolPlan(schoolPlan.key, token, newSchoolPlan)
      .subscribe(
        (response) => console.log(response),
        (error) => {throw error},
        () => alert('Notes saved.')
      )
  }

}
