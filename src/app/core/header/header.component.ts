import { Router } from '@angular/router';
import { SchoolService } from './../../shared/school.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  user1 = 'Mark';
  user2 = 'Babo';

  constructor(private schoolService: SchoolService,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
  }

  onUserChange(user: string){
    this.schoolService.activeUser = user;
    this.router.navigate(['./']);
  }

  onLogout(){
    this.authService.logout();
  }

}
