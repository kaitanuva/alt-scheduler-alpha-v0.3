import { NgForm } from '@angular/forms';
import { DataStorageService } from './../../../shared/data-storage.service';
import { Subscription } from 'rxjs/Subscription';
import { SchoolService } from './../../../shared/school.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-manage-schools-disp',
  templateUrl: './manage-schools-disp.component.html',
  styleUrls: ['./manage-schools-disp.component.css']
})
export class ManageSchoolsDispComponent implements OnInit, OnDestroy {
  @ViewChild('f') associatedALTForm: NgForm;
  id: number;
  alt: string;
  alts = [];
  altListSubscription: Subscription;
  changeOK = false;

  constructor(private route: ActivatedRoute,
              public schoolService: SchoolService,
              public dataStorageService: DataStorageService,
              public authService: AuthService) { }

  ngOnInit() {
    this.alts = this.schoolService.getAltList();

    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.alt = this.schoolService.getSchoolsList()[this.id].alt;
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
      const newALT = this.associatedALTForm.value.associatedALT;
      const school = this.schoolService.getSchoolsList()[this.id];
      school.alt = newALT;
      const editedSchool = school;
      const schoolSys = this.schoolService.schoolSys;
      const token = this.authService.token;
      this.dataStorageService.editSchoolList(editedSchool, this.id, schoolSys, token)
        .subscribe(
          (response) => console.log(response),
          (error) => console.log(error),
          () => {
            this.schoolService.editSchoolList(this.id, newALT);
            this.alt = newALT;
            alert('ALT successfully changed.')
          }
        );
    }
  }
}
