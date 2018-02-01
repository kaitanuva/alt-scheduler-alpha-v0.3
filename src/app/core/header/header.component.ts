import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { SchoolService } from './../../shared/school.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  alts = [];
  altListSubscription: Subscription;

  constructor(private schoolService: SchoolService,
              private router: Router,
              private authService: AuthService) { }

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

  onLogout(){
    this.authService.logout();
  }

}
