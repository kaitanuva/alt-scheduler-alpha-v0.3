import { SchoolPair } from './schoolpair.model';
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { SchoolService } from './school.service';

@Injectable()
export class DataStorageService{
  private schoolsList = [    
    new SchoolPair('坊津学園', 'bounotsugaku', 'mark'),
    new SchoolPair('長屋小', 'nagaya', 'mark'),
    new SchoolPair('金峰中', 'kinpou', 'mark'),
    new SchoolPair('内山田小', 'uchiyamada', 'mark'),
    new SchoolPair('加世田小', 'kasedashou', 'babo')
  ];
  alts = ['mark', 'babo'];

  constructor(private http: Http,
              private schoolService: SchoolService){}

  filterSchoolsList(altName: any, schoolName: any){
    if (altName){
      const filteredByAltList = this.schoolsList.filter(function(v,i){return (v["alt"] == altName)})
      this.schoolService.setSchoolsList(filteredByAltList);
    }
    else if (schoolName){
      const filteredBySchoolList = this.schoolsList.filter((v,i)=>{return (v["id"] == schoolName)})
      this.schoolService.setSchoolsList(filteredBySchoolList);
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

}