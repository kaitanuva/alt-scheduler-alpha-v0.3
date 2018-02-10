import { SchoolService } from './../../../shared/school.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-schools-disp',
  templateUrl: './manage-schools-disp.component.html',
  styleUrls: ['./manage-schools-disp.component.css']
})
export class ManageSchoolsDispComponent implements OnInit {
  alt: string;

  constructor(private route: ActivatedRoute,
              private schoolService: SchoolService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        this.alt = this.schoolService.getSchoolsList()[id].alt;
      }
    )
  }

}
