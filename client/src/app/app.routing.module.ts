import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {AdminComponent} from './components/admin/admin.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/app.guard';
import { NotAuthGuard } from './guards/not-auth.guard';
import { SchoolAdminComponent } from './components/school/school-admin/school-admin.component';
import { SchoolAdminGuard } from './guards/school-admin.guard';
const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path : 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path : 'register',
        component: RegisterComponent,
        canActivate: [NotAuthGuard]
    },
    {
        path : 'login',
        component: LoginComponent,
        canActivate: [NotAuthGuard]
    },
   {
        path : 'owner',
        component: AdminComponent,
        canActivate: [AdminGuard]
    },
    {
        path : 'school-admin',
        component: SchoolAdminComponent,
        canActivate: [SchoolAdminGuard]
    },
    {
        path: '**',
        component: HomeComponent
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(appRoutes)],
    providers: [],
    bootstrap: [],
    exports: [RouterModule]
})
export class AppRoutingModule { }