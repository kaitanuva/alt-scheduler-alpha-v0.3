import { RedirectComponent } from './redirect/redirect.component';
import { EditGuard } from './auth/edit-guard.service';
import { SchooldetailComponent } from './schools/schooldetail/schooldetail.component';
import { SchoolsComponent } from './schools/schools.component';
import { SchooleditComponent } from './sched-display/schooledit/schooledit.component';
import { SchoolNewComponent } from './sched-display/school-new/school-new.component';
import { NgModule } from "@angular/core";
import { SchedDisplayComponent } from './sched-display/sched-display.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { SchoolPlanNewComponent } from './schools/school-plan-new/school-plan-new.component';
import { SchoolPlanEditComponent } from './schools/school-plan-edit/school-plan-edit.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth-guard.service';
import { RedirectGuard } from './redirect/redirect-guard.service';
import { SchoolGuard } from './auth/school-guard.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'reloading', component: RedirectComponent, canActivate: [RedirectGuard]},
  { path: 'schedule', component: SchedDisplayComponent, canActivate: [AuthGuard]},
  { path: ':id/edit', component: SchooleditComponent, canActivate: [AuthGuard]},
  { path: ':id/new', component: SchoolNewComponent, canActivate: [AuthGuard]},
  { path: 'schools', component: SchoolsComponent, canActivate: [AuthGuard], children:[
    { path: ':id', component: SchooldetailComponent, canActivate: [SchoolGuard]},
    { path: ':id/new', component: SchoolPlanNewComponent, canActivate: [EditGuard]},
    { path: ':id/edit', component: SchoolPlanEditComponent, canActivate: [EditGuard]}
  ]},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule{
  
}