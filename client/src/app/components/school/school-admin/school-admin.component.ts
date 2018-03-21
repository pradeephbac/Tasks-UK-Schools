import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { SchoolService } from '../../../services/adminServices/school.service';

@Component({
  selector: 'app-school-admin',
  templateUrl: './school-admin.component.html',
  styleUrls: ['./school-admin.component.scss']
})
export class SchoolAdminComponent implements OnInit {
  adminUser;
  adminSchool;
  step: string;
  filtersLoaded = false;
  usersLoaded = false;
  selectedTask: any;
  public newUser = {
    email: '',
    username: '',
    password: ''
  };
  selectableUsers = [];
  selectedUser: any;
  constructor(private authService: AuthService, private schoolService: SchoolService) { }

  updateTask(){ 
    this.schoolService.updateTaskDeadline(this.adminSchool._id, this.selectedTask).subscribe(data => { 
      if (!data.success) {
      } else { 
        document.getElementById('update-task-dismiss').click(); 
      }
    });
  }

  addAssignee(task, adminSchool) {
    this.adminSchool = adminSchool;
    this.selectedTask = task;
    this.selectableUsers = [];

    if (!this.selectedTask.assignees) {
      this.selectedTask.assignees = [];
    }

    const assignnableUser = [];
    this.adminSchool.users.forEach(user => {
      let found = false;
      this.selectedTask.assignees.forEach(assignee => {
        if (assignee._id === user._id) {
          found = true;
        }
      });

      if (!found) {
        this.selectableUsers.push(user);
      }

    }); 
    document.getElementById('assignNewUserButton').click();
  }

  assignUsers(adminSchool, selectedUser) {
    const currentSelectedUser = this.selectableUsers.filter(value => value._id ===  selectedUser); 

    const assignObject = {
      assignee: currentSelectedUser[0],
      org_id: this.adminSchool._id,
      task_id:  this.selectedTask._id,
      selectedTask: this.selectedTask
    }
    this.schoolService.assignUsersForTasks(assignObject).subscribe(data => { 
      if (!data.success) {
      } else {
        document.getElementById('assign-user-dismiss').click();
        this.adminUser = this.authService.user;
        this.fetchOrgnatation(this.adminUser.id)
      }
    });
  }


  addUser(adminSchool) {
    this.adminSchool = adminSchool;
    document.getElementById('openExpandedSchool').click();
  }

  expandTask(taskItem: any) {
    this.selectedTask = taskItem;
    document.getElementById('openExpandedTask').click();
  }

  saveUser(user) {
    const userData = {
      org_id: this.adminSchool._id,
      email: user.email,
      password: user.password,
      username: user.username
    }
    this.schoolService.postSingleUser(userData).subscribe(data => { 
      if (!data.success) {
      } else {
        this.adminSchool.users.push(data.user);
      }
    });
    document.getElementById('add-user-dismiss').click();
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
        this.filtersLoaded = true;
        if (this.adminSchool.users) {
          this.usersLoaded = true;
        }
      }
    });
  }
  clickHeaderOne() {

  }
  clickHeaderTwo() {

  }
  ngOnInit() {
    this.adminUser = this.authService.user;
    this.fetchOrgnatation(this.adminUser.id)
  }

}
