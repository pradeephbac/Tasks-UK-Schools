import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { environment } from '../../../environments/environment';
@Injectable()
export class TaskService {
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



getAllTasks() {
   this.createAuthHeaders(); // this.options
   return this.http.get(this.LOCAL_DOMAIN + '/tasks/allTasks', this.options).map(res => res.json());
 }

 postTasks(task) {
  this.createAuthHeaders(); // this.options
  return this.http.post(this.LOCAL_DOMAIN + '/tasks/addTask', task, this.options  ).map(res => res.json());
}

getAllTasksByUser(org_id, user_id) {
  this.createAuthHeaders(); // this.options
  return this.http.get(this.LOCAL_DOMAIN + '/organizations/tasksInstancesByUser/' + org_id + '/' + user_id, this.options)
  .map(res => res.json());
}

getUserRoleMapping(user_id) {
  this.createAuthHeaders(); // this.options
  return this.http.get(this.LOCAL_DOMAIN + '/organizations/userrole/' + user_id, this.options).map(res => res.json());
}

}
