import { SchoolGuard } from './auth/school-guard.service';
import { DataStorageService } from './shared/data-storage.service';
import { RedirectGuard } from './redirect/redirect-guard.service';
import { RedirectService } from './redirect/redirect.service';
import { EditGuard } from './auth/edit-guard.service';
import { AuthService } from './auth/auth.service';
import { SchoolNewComponent } from './sched-display/school-new/school-new.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { SchoolService } from './shared/school.service';
import { HomeComponent } from './core/home/home.component';
import { SchedDisplayComponent } from './sched-display/sched-display.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './core/header/header.component';
import { SchooleditComponent } from './sched-display/schooledit/schooledit.component';
import { TimeService } from './shared/time.service';
import { SchoolsComponent } from './schools/schools.component';
import { SchooldetailComponent } from './schools/schooldetail/schooldetail.component';
import { SchoolPlanNewComponent } from './schools/school-plan-new/school-plan-new.component';
import { SchoolPlanEditComponent } from './schools/school-plan-edit/school-plan-edit.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HttpModule } from '@angular/http';
import { AuthGuard } from './auth/auth-guard.service';
import { RedirectComponent } from './redirect/redirect.component';
import { GlobalErrorHandler } from './error-handler';
import { PasswordPipe } from './shared/password.pipe';
import { ManageAltsComponent } from './manage/manage-alts/manage-alts.component';
import { ManageSchoolsComponent } from './manage/manage-schools/manage-schools.component';
import { MainGuard } from './manage/main-guard.service';
import { ManageSchoolsDispComponent } from './manage/manage-schools/manage-schools-disp/manage-schools-disp.component';
import { ManageAltsDispComponent } from './manage/manage-alts/manage-alts-disp/manage-alts-disp.component';

@NgModule({
  declarations: [
    AppComponent,
    SchedDisplayComponent,
    HomeComponent,
    HeaderComponent,
    SchooleditComponent,
    SchoolNewComponent,
    SchoolsComponent,
    SchooldetailComponent,
    SchoolPlanNewComponent,
    SchoolPlanEditComponent,
    DropdownDirective,
    LoginComponent,
    SignupComponent,
    RedirectComponent,
    PasswordPipe,
    ManageAltsComponent,
    ManageSchoolsComponent,
    ManageSchoolsDispComponent,
    ManageAltsDispComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [
    {provide: ErrorHandler,
     useClass: GlobalErrorHandler},
    SchoolService, 
    TimeService, 
    AuthService,
    RedirectService,
    AuthGuard, 
    EditGuard,
    RedirectGuard,
    SchoolGuard,
    MainGuard,
    DataStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
