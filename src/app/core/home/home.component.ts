import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../shared/school.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private schoolService: SchoolService) { }

  ngOnInit() {
    // const loggedInSchool = this.schoolService.loggedInSchool;
    // if (loggedInSchool){
    //   const index = this.schoolService.getIDFromSchoolListbyRomaji(loggedInSchool);
    //   this.schoolService.loggedInSchoolIndex = index;
    // }
  }

}
