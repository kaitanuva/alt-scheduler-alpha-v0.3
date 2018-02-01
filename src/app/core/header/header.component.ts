import { DataStorageService } from './../../shared/data-storage.service';
import { Router } from '@angular/router';
import { SchoolService } from './../../shared/school.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  alts = [];

  constructor(private schoolService: SchoolService,
              private router: Router,
              private authService: AuthService,
              private dataStorageService: DataStorageService) { }

  ngOnInit() {
    this.dataStorageService.retrieveAltList(this.authService.token)
      .subscribe(
        (altList) => {
          this.alts = Object.values(altList)[0];
          console.log(this.alts)
        }
      );
      
  }

  onUserChange(alt: string){
    this.schoolService.activeUser = alt;
    this.router.navigate(['./']);
  }

  onLogout(){
    this.authService.logout();
  }

}
