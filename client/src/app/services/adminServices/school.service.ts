import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { environment } from '../../../environments/environment';

@Injectable()
export class SchoolService {
  LOCAL_DOMAIN = environment.LOCAL_DOMAIN;
  token;
  authToken; 
  options; 

  constructor(private http: Http) { }

  loadToken() {
    this.authToken = localStorage.getItem('token');
  }


  createAuthHeaders() {
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'autherization': this.authToken
      })
    });
  }

  getAllOrganizations() { 
    this.createAuthHeaders(); // this.options
    return this.http.get(this.LOCAL_DOMAIN + '/organizations/allSchools', this.options).map(res => res.json());
  }

  postOrganizations(school) {
   return this.http.post(this.LOCAL_DOMAIN + '/organizations/addSchool', school).map(res => res.json()); 
 }

 postSingleUser(userData) { 
  return this.http.post(this.LOCAL_DOMAIN + '/organizations/addUser', userData).map(res => res.json()); 
}


 updateOrganizations(schoolId, taskList) {
  return this.http.put(this.LOCAL_DOMAIN + '/organizations/update/' + schoolId, taskList).map(res => res.json());
}

getAllOrganizationByAdminId(adminId) { 
  this.createAuthHeaders(); // this.options
  return this.http.get(this.LOCAL_DOMAIN + '/organizations/schoolByUser/' + adminId, this.options).map(res => res.json());
}
 
assignUsersForTasks(assignObject){
  return this.http.post(this.LOCAL_DOMAIN + '/organizations/assignusers/'
  + assignObject.org_id + '/' + assignObject.task_id, assignObject)
  .map(res => res.json());
}

updateTaskDeadline(org_id, task){
  return this.http.post(this.LOCAL_DOMAIN + '/organizations/updatetask/' + org_id, task).map(res => res.json()); 
}


}
