import { SchoolPair } from './../shared/schoolpair.model';
import { Router } from '@angular/router';
import { SchoolService } from './../shared/school.service';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css']
})
export class SchoolsComponent implements OnInit, OnDestroy {
  schoolsList = [];
  schoolsListSubscription: Subscription;

  constructor(private schoolService: SchoolService,
              private router: Router) {}

  ngOnInit() {
    let retrievedList = this.schoolService.getSchoolsList();
    for (let school of retrievedList){
      this.schoolsList.push(school.school);
    }
    const loggedInSchool = this.schoolService.loggedInSchool;
    if (loggedInSchool){
      const index = this.schoolService.getIDFromSchoolListbyRomaji(loggedInSchool);
      this.schoolService.loggedInSchoolIndex = index;
      this.schoolService.selectedSchoolIndex = index;
      this.schoolService.selectedSchool = this.schoolService.getSchoolFromSchoolList(index);
      this.router.navigate(['./schools/'+index]);
    }
    this.schoolsListSubscription = this.schoolService.schoolsListChanged
      .subscribe(
        (updatedSchoolList: SchoolPair[]) => {
          let newList = [];
          for (let school of updatedSchoolList){
            newList.push(school.school);
          }
          this.schoolsList = newList;
        }
      );
  }

  ngOnDestroy(){
    if (this.schoolsListSubscription){
      this.schoolsListSubscription.unsubscribe();
    }
  }

  schoolClicked(index: number){
    this.schoolService.selectedSchool = this.schoolService.getSchoolFromSchoolList(index);
    this.schoolService.selectedSchoolIndex = index;
  }
}
