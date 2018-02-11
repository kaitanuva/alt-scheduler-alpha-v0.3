import { Subscription } from 'rxjs/Subscription';
import { SchoolService } from './../../shared/school.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-alts',
  templateUrl: './manage-alts.component.html',
  styleUrls: ['./manage-alts.component.css']
})
export class ManageAltsComponent implements OnInit {
  newClicked = false;
  alts = [];
  altListSubscription: Subscription;

  constructor(private schoolService: SchoolService) { }

  ngOnInit() {
    this.alts = this.schoolService.getAltList();

    this.altListSubscription = this.schoolService.altListChanged.subscribe(
      (altList: string[]) => {
        this.alts = altList;
      }
    );
  }

  preventSpaces(event){
    var k = event.which || event.keyCode;
    if (k == 32) return false;
  }

  newALT(){
    this.newClicked = !this.newClicked;
  }

  onSave(){

  }

}
