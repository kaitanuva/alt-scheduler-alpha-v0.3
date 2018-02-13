import { DataStorageService } from './../../shared/data-storage.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { SchoolService } from './../../shared/school.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  alts = [];
  altListSubscription: Subscription;

  constructor(public schoolService: SchoolService,
              private router: Router,
              public authService: AuthService,
              public dataStorageService: DataStorageService) { }

  ngOnInit() {
    this.altListSubscription = this.schoolService.altListChanged.subscribe(
      (altList: string[]) => {
        this.alts = altList;
      }
    )
  }

  ngOnDestroy(){
    this.altListSubscription.unsubscribe();
  }

  onUserChange(alt: string){
    this.schoolService.activeUser = alt;
    this.router.navigate(['./']);
  }

  onDeleteAccount(){
    if (confirm('Are you sure want to delete this account?'
          + '\n本当にアカウントを削除しますか？')){
      firebase.auth().currentUser.delete()
        .then(
          () => {
            if (this.authService.userType == 'school'){
              const token = this.authService.token;
              const schoolName = this.authService.schoolName;
              const id = this.schoolService.getIDFromSchoolListbyRomaji(schoolName);
              const schoolSys = this.schoolService.schoolSys;
              this.dataStorageService.removeSchoolList(schoolSys, token)
                .subscribe(
                  (response) => console.log(response),
                  (error) => console.log(error),
                  () => {
                    this.schoolService.deleteFromSchoolList(id);
                    const newSchoolList = this.schoolService.getSchoolsList();
                    this.dataStorageService.createSchoolList(newSchoolList, schoolSys, token)
                      .subscribe(
                        (response) => console.log(response),
                        (error) => console.log(error),
                        () => {
                          alert('Account deleted.');
                          this.authService.logout();
                        }
                      );
                  }
                );
            }
            else if (this.authService.userType == 'alt'){
              const token = this.authService.token;
              const alt = this.authService.altName;
              const schoolSys = this.schoolService.schoolSys;
              this.dataStorageService.removeAltList(schoolSys, token)
                .subscribe(
                  (response) => console.log(response),
                  (error) => console.log(error),
                  () => {
                    this.schoolService.deleteFromAltList(alt);
                    const newAltList = this.schoolService.getAltList();
                    this.dataStorageService.createAltList(newAltList, schoolSys, token)
                      .subscribe(
                        (response) => console.log(response),
                        (error) => console.log(error),
                        () => {
                          alert('Account deleted.');
                          this.authService.logout();
                        }
                      );
                  }
                );
            }
            else {
              //delete main
              this.dataStorageService.retrieveSchoolSystems()
                .subscribe(
                  (schoolSystems) => {
                    const token = this.authService.token;
                    const schoolSys = this.schoolService.schoolSys;
                    const index = Object.values(schoolSystems).indexOf(this.schoolService.schoolSys);
                    const key = Object.keys(schoolSystems)[index];
                    let promises = [];
                    promises.push(this.dataStorageService.deleteFromSchoolSystem(key, token)
                      .subscribe(
                        (error) => console.log(error),
                        () => console.log('school system deleted')
                      ));
                    promises.push(this.dataStorageService.deleteSchoolSysFromCore(schoolSys, token)
                      .subscribe(
                        (error) => console.log(error),
                        () => console.log('core deleted')
                      ));
                    Promise.all(promises)
                      .then(
                        () => {
                          alert('School system successfully deleted.');
                          this.authService.logout();
                        }
                      )
                  }
                )
            }
          }
        )
        .catch(
          (error) => alert(error)
        )
    }
    else{
      return;
    }

  }

  onLogout(){
    this.authService.logout();
  }

}
