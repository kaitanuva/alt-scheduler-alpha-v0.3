import { SchoolPair } from './schoolpair.model';
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { SchoolService } from './school.service';

@Injectable()
export class DataStorageService{
  private schoolsList = [    
    new SchoolPair('坊津学園', 'mark'),
    new SchoolPair('長屋小', 'mark'),
    new SchoolPair('金峰中', 'mark'),
    new SchoolPair('内山田小', 'mark'),
    new SchoolPair('加世田小', 'babo')
  ];

  constructor(private http: Http,
              private schoolService: SchoolService){}

  getSchoolsList(altName: any){
    if (altName){
      const filteredByAltList = this.schoolsList.filter(function(v,i){return (v["alt"] == altName)})
      this.schoolService.setSchoolsList(filteredByAltList);
    }
    else{
      this.schoolService.setSchoolsList(this.schoolsList.slice());
    }
  }

}