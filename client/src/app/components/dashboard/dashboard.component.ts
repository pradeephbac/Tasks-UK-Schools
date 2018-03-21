import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/adminServices/task.service';
import { SchoolService } from '../../services/adminServices/school.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private bodyText: string;
  roleMapping: any;
  taskInstances = [];
  isTaskLoaded = false;
  isAdminLoaded = false;
  loggedUser: any;
  activeClass = 'analytics';
  adminSchool: any;
  constructor(private authService: AuthService, private taskService: TaskService, private schoolService: SchoolService) {
  }

  fetchRoleMapping(user): Promise<any> {
    return this.taskService.getUserRoleMapping(user.id).map((response) => {
      this.roleMapping = response.roleMapping;
      this.fetchTaskInstances(this.roleMapping.school_id, this.roleMapping.user_id);
    }
    ).toPromise();
  }

  fetchTaskInstances(schoolId, userId): Promise<any> {
    return this.taskService.getAllTasksByUser(schoolId, userId)
      .map((response) => {
        this.taskInstances = response.tasks;
        this.isTaskLoaded = true;
      })
      .toPromise();
  }

  selectCage(cage){
    if (cage === 'analytics') {
      this.activeClass = 'analytics';
    }
    if (cage === 'tasks') {
      this.activeClass = 'tasks';
    }
    if (cage === 'in-progress') {
      this.activeClass = 'in-progress';
    }
    if (cage === 'completed') {
      this.activeClass = 'completed';
    }
    if (cage === 'overdue') {
      this.activeClass = 'overdue';
    }
  }

  fetchOrgnatation(adminId) {
    this.schoolService.getAllOrganizationByAdminId(adminId).subscribe(data => {
      if (!data.success) {
        this.adminSchool = {};
        if (!this.adminSchool.tasks) {
          this.adminSchool.tasks = [];
        }
      } else {
        this.adminSchool = data.organization;
        if (!this.adminSchool.tasks) {
          this.adminSchool.tasks = [];
        }
        this.isAdminLoaded = true;
      }
    });
  }

  ngOnInit() {
    this.loggedUser = this.authService.user;
    if ( this.loggedUser.role === 'user' ) {
      this.fetchRoleMapping(this.loggedUser);
    }
    if ( this.loggedUser.role === 'admin' ) {
      this.fetchOrgnatation(this.loggedUser.id);
    }
  }
}
