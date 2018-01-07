import { Subject } from 'rxjs/Subject';

export class RedirectService{
  canRedirect = false;
  redirectRoute: string;
  logout = false;

  canRedirectSwitch = new Subject<boolean>();
}