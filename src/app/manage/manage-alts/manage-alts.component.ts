import { DataStorageService } from './../../shared/data-storage.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { SchoolService } from './../../shared/school.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-manage-alts',
  templateUrl: './manage-alts.component.html',
  styleUrls: ['./manage-alts.component.css']
})
export class ManageAltsComponent implements OnInit {
  @ViewChild('f') newALTForm: NgForm;
  newClicked = false;
  alts = [];
  altListSubscription: Subscription;

  constructor(private schoolService: SchoolService,
              private authService: AuthService,
              private dataStorageService: DataStorageService) { }

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
    const name = this.newALTForm.value.name;
    const password = this.newALTForm.value.password;
    const reenterpw = this.newALTForm.value.reenterpw;
    const email = name + '-alt@' + this.schoolService.schoolSys + '.jp';
    const found = this.schoolService.checkIfALTAlreadyExists(name);
    if (found){
      alert('That ALT already exists.')
    }
    else if (password != reenterpw){
      alert('The entered passwords are not equal.')
    }
    else{
      if(confirm("Are you sure you want to add the ALT " + "'" + name + "'?")){
        firebase.auth().fetchProvidersForEmail(email)
        .then(
          (response: string[]) => {
            if (response.length == 0){
              const token = this.authService.token;
              const schoolSys = this.schoolService.schoolSys;
              this.dataStorageService.removeAltList(schoolSys, token)
                .subscribe(
                  (response) => console.log(response),
                  (error) => console.log(error),
                  () => {
                    this.schoolService.addToALTList(name);
                    const newALTList = this.schoolService.getAltList();
                    this.dataStorageService.createAltList(newALTList, schoolSys, token)
                      .subscribe(
                        (response) => console.log(response),
                        (error) => console.log(error),
                        () => {
                          firebase.auth().createUserWithEmailAndPassword(email, password)
                            .then(
                              () => {
                                console.log('alt successfully registered');
                                this.newALTForm.reset();
                                alert('ALT was successfully added!\n\nYour account username is: '+
                                  email + '\n\nPlease save this data. この情報をメモしてください。');
                                alert('Please login again.' + 'もう一度サインインしてください。。');
                                this.authService.logout();
                              }
                            )
                            .catch(
                              (error) => {
                                console.log(error);
                                alert('There was an error in registering the email.');
                              }
                          )
                        }
                      );

                  }
                );
            }
            else {
              alert('That email address is not available.');
            }
          }
        )
      }
      else{
        return;
      }
    }
  }

}
