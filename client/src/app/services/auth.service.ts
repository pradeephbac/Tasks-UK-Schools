import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  LOCAL_DOMAIN = environment.LOCAL_DOMAIN;
  token;
  authToken;
  options;
  user;

  constructor(private http: Http) {
  }

  registerNewUser(user) {
    return this.http.post(this.LOCAL_DOMAIN + '/authentication/register', user).map(res => res.json());
  }

  userLogin(user) {
    return this.http.post(this.LOCAL_DOMAIN + '/authentication/login', user).map(res => res.json());
  }

  fogotPasssword(user) {
    return this.http.post(this.LOCAL_DOMAIN + '/authentication/fogotpassword', user).map(res => res.json());
  }

  userLogOut() {
    this.token = null;
    this.user = null;
    localStorage.clear();

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

  loadToken() {
    this.authToken = localStorage.getItem('token');
  }



  storeuserInFrontEnd(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.token = token;
    this.user = user;
  }


  isUserLoggedIn() {
    return tokenNotExpired();
  }

  isSuperAdmin() {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user && this.user.role === 'super_admin') {
      return true;
    } else {
      return false;
    }
  } 

  isSchoolAdmin() {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user && this.user.role === 'admin') {
      return true;
    } else {
      return false;
    }
  }

  loadUser() {
    return localStorage.getItem('user');
  }
}
