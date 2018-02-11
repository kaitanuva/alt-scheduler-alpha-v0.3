import { Subscription } from 'rxjs/Subscription';
import { SchoolService } from './../../../shared/school.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-manage-schools-disp',
  templateUrl: './manage-schools-disp.component.html',
  styleUrls: ['./manage-schools-disp.component.css']
})
export class ManageSchoolsDispComponent implements OnInit, OnDestroy {
  alt: string;
  alts = [];
  altListSubscription: Subscription;
  changeOK = false;

  constructor(private route: ActivatedRoute,
              private schoolService: SchoolService) { }

  ngOnInit() {
    this.alts = this.schoolService.getAltList();

    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        this.alt = this.schoolService.getSchoolsList()[id].alt;
      }
    );

    this.altListSubscription = this.schoolService.altListChanged.subscribe(
      (altList: string[]) => {
        this.alts = altList;
      }
    );
  }

  ngOnDestroy(){
    if (this.altListSubscription){
      this.altListSubscription.unsubscribe();
    }
  }

  onChange(){
    this.changeOK = !this.changeOK;
  }

  onSave(){
    if(confirm('Are you sure you want to save the new ALT?')){
      //change alt
      console.log('saved!')
    }
  }
}
