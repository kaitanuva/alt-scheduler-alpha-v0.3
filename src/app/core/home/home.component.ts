import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SchoolService } from '../../shared/school.service';
import { SchoolPlan } from './../../shared/schoolplan.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{
  theDate = new Date();
  currentMonth = this.theDate.getMonth();
  currentYear = this.theDate.getFullYear();
  currentDate = this.theDate.getDate();
  schoolPlansList = [];
  hidden = true;
  schoolPlansSubscription: Subscription;

  constructor(public schoolService: SchoolService,
              public authService: AuthService) { }

  ngOnInit() {
    if (this.authService.userType === 'alt'){
      this.schoolPlansSubscription = this.schoolService.schoolPlansChanged
        .subscribe(
          (schoolPlans: SchoolPlan[]) => {
            let filteredPlans = schoolPlans.filter((v,i) => {
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

}
