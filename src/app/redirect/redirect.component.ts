import { Router } from '@angular/router';
import { RedirectService } from './redirect.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html'
})
export class RedirectComponent implements OnInit, OnDestroy {

  constructor(public redirectService: RedirectService,
              private router: Router) { }

  ngOnInit() {
    const redirectRoute = this.redirectService.redirectRoute;
    setTimeout( () => {
      this.router.navigate([redirectRoute]);
      this.redirectService.canRedirectSwitch.next(false);
    }, 1000);
  }

  ngOnDestroy(){
  }

}
