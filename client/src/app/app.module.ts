import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing.module';
import { HttpModule } from '@angular/http';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';


import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component'; 

import {FlashMessagesModule} from 'angular2-flash-messages';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
 
// manually created services
import {AuthService} from './services/auth.service';
import {SchoolService} from './services/adminServices/school.service'; 
import { TaskService } from './services/adminServices/task.service';

// URL interceptors for guarding
import { AuthGuard } from './guards/app.guard';
import { NotAuthGuard } from './guards/not-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import {SchoolAdminGuard} from './guards/school-admin.guard';
import { SchoolAdminComponent } from './components/school/school-admin/school-admin.component'; 
 

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    AdminComponent,
    SchoolAdminComponent 
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    HttpModule,
    Angular2FontawesomeModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2FilterPipeModule,
    FlashMessagesModule.forRoot() 
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, AdminGuard, SchoolService, TaskService, SchoolAdminGuard],
  bootstrap: [AppComponent] 
})
export class AppModule { }
