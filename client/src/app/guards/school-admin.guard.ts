import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SchoolAdminGuard implements CanActivate {
  constructor(
    private authService: AuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      // Check if user is logge din
    if (this.authService.isSchoolAdmin()) {
      return true; // Return true: User is allowed to view route
    } else {
      return false; // Return false: user not authorized to view page
    }
  }
}
