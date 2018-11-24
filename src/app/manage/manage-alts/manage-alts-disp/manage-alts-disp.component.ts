import { ActivatedRoute, Params } from '@angular/router';
import { SchoolService } from './../../../shared/school.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-alts-disp',
  templateUrl: './manage-alts-disp.component.html',
  styleUrls: ['./manage-alts-disp.component.css']
})
export class ManageAltsDispComponent implements OnInit {
  filteredSchoolsList = [];

  constructor(public schoolService: SchoolService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        const alt = this.schoolService.getAltList()[id];
        if (!alt){
          throw new Error;
        }
        const schoolsList = this.schoolService.getSchoolsList();
        let newList = [];
        let finalList = [];
        newList.push.apply(newList, schoolsList.filter((v,i) => {
          return (v["alt"] == alt);
        }));
        for (let school of newList){
          finalList.push(school.school);
        }
        this.filteredSchoolsList = finalList;
      }
    );
    
  }

}
