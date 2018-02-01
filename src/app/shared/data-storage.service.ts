import { SchoolPlan } from './schoolplan.model';
import { SchoolPair } from './schoolpair.model';
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { SchoolService } from './school.service';
import 'rxjs/Rx';
import { School } from './school.model';

@Injectable()
export class DataStorageService{
  alts = ['mark', 'babo'];

  private schoolsList = [    
    new SchoolPair('坊津学園', 'bounotsu', 'mark'),
    new SchoolPair('長屋小', 'nagaya', 'mark'),
    new SchoolPair('金峰中', 'kinpou', 'mark'),
    new SchoolPair('内山田小', 'uchiyamada', 'mark'),
    new SchoolPair('加世田小', 'kasedashou', 'babo')
  ];

  constructor(private http: Http,
              private schoolService: SchoolService){}

  filterSchoolsList(altName: any, schoolName: any){
    if (altName){
      const filteredByAltList = this.schoolsList.filter(function(v,i){return (v["alt"] == altName)})
      this.schoolService.setSchoolsList(filteredByAltList);
    }
    else if (schoolName){
      altName = this.getALTassociatedWithSchool(schoolName);
      const filteredByAltList = this.schoolsList.filter(function(v,i){return (v["alt"] == altName)})
      this.schoolService.setSchoolsList(filteredByAltList);
    }
    else{
      this.schoolService.setSchoolsList(this.schoolsList.slice());
    }
  }

  getALTassociatedWithSchool(schoolName: string){
    const associatedALT = this.schoolsList.find(
      (v,i)=>{return (v["id"] == schoolName)}
    ).alt;
    return associatedALT;
  }

  //~~~~~~~~~~~~~~Alt List Methods~~~~~~~~~~~~~~~//

  retrieveAltList(token: string){
    return this.http.get('https://ng-alt-scheduler.firebaseio.com/' + this.schoolService.schoolSys +
      '/altlist.json?auth=' + token)
      .map(
        (response: Response) => {
          const altList = response.json();
          return altList;
        }
      )
  }

  //~~~~~~~~~~~~~~School List Methods~~~~~~~~~~~~~~~//

  retrieveSchoolList(token: string){
    return this.http.get('https://ng-alt-scheduler.firebaseio.com/' + this.schoolService.schoolSys +
      '/schoollist.json?auth=' + token)
      .map(
        (response: Response) => {
          const schoolList = response.json();
          return schoolList;
        }
      )
  }

  //~~~~~~~~~~Approval List Methods~~~~~~~~~~~~~~//

  retrieveApprovalList(token: string){
    return this.http.get('https://ng-alt-scheduler.firebaseio.com/' + this.schoolService.schoolSys +
      '/approvallist.json?auth=' + token)
      .map(
        (response: Response) => {
          const schoolPlans = response.json();
          return schoolPlans;
        }
      );
  }

  addToApprovalList(status: string, time: string, schoolPlan: SchoolPlan, token: string){
    schoolPlan.status = status;
    schoolPlan.time = time;
    return this.http.post('https://ng-alt-scheduler.firebaseio.com/' + this.schoolService.schoolSys +
      '/approvallist.json?auth=' + token, schoolPlan);
  }

  removeFromApprovalList(key: string, token: string){
    return this.http.delete('https://ng-alt-scheduler.firebaseio.com/' + this.schoolService.schoolSys +
      '/approvallist/' + key + '.json?auth=' + token);
  }

  //~~~~~~~~~~School Disp List Methods~~~~~~~~~~~~~~//
  
  retrieveSchoolDispList(token: string){
    return this.http.get('https://ng-alt-scheduler.firebaseio.com/' + this.schoolService.schoolSys +
      '/schooldisp.json?auth=' + token)
      .map(
        (response: Response) => {
          const schoolDispList = response.json();
          return schoolDispList;
        }
      )
  }

  addToSchoolDispList(approvedSchool: School, token: string){
    return this.http.post('https://ng-alt-scheduler.firebaseio.com/' + this.schoolService.schoolSys +
      '/schooldisp.json?auth=' + token, approvedSchool);
    // return this.http.post('https://ng-alt-scheduler.firebaseio.com/schooldisp.json?auth=' + token, approvedSchool);
  }

  editSchoolDisp(key: string, token: string, newSchool: School){
    return this.http.patch('https://ng-alt-scheduler.firebaseio.com/' + this.schoolService.schoolSys +
      '/schooldisp.json?auth=' + token, newSchool);
  }

  removeFromDispList(key: string, token: string){
    return this.http.delete('https://ng-alt-scheduler.firebaseio.com/' + this.schoolService.schoolSys + 
      '/schooldisp/' + key + '.json?auth=' + token);
  }
  
  //~~~~~~~~~~School Plans List Methods~~~~~~~~~~~~~~//

  retrieveSchoolPlans(token: string){
    return this.http.get('https://ng-alt-scheduler.firebaseio.com/' + this.schoolService.schoolSys +
      '/schoolplans.json?auth=' + token)
      .map(
        (response: Response) => {
          const schoolPlans = response.json();
          return schoolPlans;
        }
      );
  }

  addToSchoolPlans(schoolPlan: SchoolPlan, token: string){
    return this.http.post('https://ng-alt-scheduler.firebaseio.com/' + this.schoolService.schoolSys +
      '/schoolplans.json?auth=' + token, schoolPlan);
  }

  editSchoolPlan(key: string, token: string, newSchoolPlan: SchoolPlan){
    return this.http.patch('https://ng-alt-scheduler.firebaseio.com/' + this.schoolService.schoolSys +
      '/schoolplans/' + key + '.json?auth=' + token, newSchoolPlan);
  }

  removeFromSchoolPlans(key: string, token: string){
    return this.http.delete('https://ng-alt-scheduler.firebaseio.com/' + this.schoolService.schoolSys +
      '/schoolplans/' + key + '.json?auth=' + token);
  }

  ///~~~~~~~~ Signup Methods ~~~~~~~~~~//

  createAltList(altList: string[], schoolSys: string, token: string){
    return this.http.post('https://ng-alt-scheduler.firebaseio.com/' + schoolSys +
      '/altlist.json?auth=' + token, altList);
  }

  createSchoolList(schoolList: SchoolPair[], schoolSys: string, token: string){
    return this.http.post('https://ng-alt-scheduler.firebaseio.com/' + schoolSys +
      '/schoollist.json?auth=' + token, schoolList);
  }
}