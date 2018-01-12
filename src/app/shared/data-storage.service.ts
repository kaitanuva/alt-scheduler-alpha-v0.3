import { SchoolPlan } from './schoolplan.model';
import { SchoolPair } from './schoolpair.model';
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { SchoolService } from './school.service';

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
  
  private schoolPlans = [
    // new SchoolPlan('坊津学園', 2017, 12, 1, '金', '(1) 8:40-9:25',
    // '(2) 9:40-10:25', '(3) 10:40-11:25', '(4) 11:40-12:25',
    // '(5) 2:20-3:05', '(6) 3:20-4:05', '1', '2', '3', '4', '5', '6',
    // 'Suzuki' , 'Yamada', 'Hamada', 'Ueda', 'Ueno', 'Hashimoto',
    // 'Numbers', 'Fruits', 'Animals', '好きなこと',
    // 'Hi Friends 1 Lesson 1 - Hello',
    // 'Hi Friends 2 Lesson 6 - Lets go to Italy', 'Lunch', '6', 'Yamada'),

    // new SchoolPlan('長屋小', 2018, 1, 11, '木', '(1) 8:40-9:25',
    // '(2) 9:40-10:25', '(3) 10:40-11:25', '(4) 11:40-12:25',
    // '(5) 2:20-3:05', '(6) 3:20-4:05', '1', '2', '3', '4', '5', '6',
    // 'Suzuki' , 'Yamada', 'Hamada', 'Ueda', 'Ueno', 'Hashimoto',
    // 'Numbers', 'Fruits', 'Animals', '好きなこと',
    // 'Hi Friends 1 Lesson 1 - Hello',
    // 'Hi Friends 2 Lesson 6 - Lets go to Italy', 'Lunch', '6', 'Yamada'),

    // new SchoolPlan('金峰中', 2017, 12, 5, '水', '',
    // '', '', '', '(5) 2:20-3:05', '(6) 3:20-4:05', '', '', '', '', '1', '3',
    // '' , '', '', '', 'Ueno', 'Hashimoto', '', '', '', '',
    // 'New Horizon 1',
    // 'New Horizon 3', 'Lunch', '2', 'Yamada'),

    // new SchoolPlan('加世田小', 2017, 12, 4, '水', '',
    // '', '', '', '(5) 2:20-3:05', '(6) 3:20-4:05', '', '', '', '', '1', '3',
    // '' , '', '', '', 'Ueno', 'Hashimoto', '', '', '', '',
    // 'New Horizon 1',
    // 'New Horizon 3', 'Lunch', '2', 'Yamada')
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

  // retrieveAndSetSchoolPlans(token: string){
  //   return this.http.get('https://ng-alt-scheduler.firebaseio.com/data.json?auth=' + token)
  //     .map(
  //       (response: Response) => {
  //         const schoolPlans = response.json();
  //         return schoolPlans;
  //       }
  //     );
  //   // this.schoolService.setSchoolPlans(this.schoolPlans);
  // }

  requestSchoolPlan(status: string, time: string, schoolPlan: SchoolPlan, token: string){
    schoolPlan.status = status;
    schoolPlan.time = time;
    return this.http.post('https://ng-alt-scheduler.firebaseio.com/data.json?auth=' + token
    , schoolPlan);
  }

}