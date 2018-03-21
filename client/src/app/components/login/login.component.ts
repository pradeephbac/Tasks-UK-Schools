import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  messageClass;
  message;
  processing = false;
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  fogotPassword = false;
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router ){
    this.creatLoginForm();
    this.creatForgotPasswordForm();
  }

  creatLoginForm () {
    this.loginForm  =  this.formBuilder.group({
      email : ['', Validators.required],
      password : ['', Validators.required]
    });
  }

  disableForm() { 
    this.loginForm.controls['password'].disable();
    this.loginForm.controls['email'].disable();
  }

  enableForm() { 
    this.loginForm.controls['password'].enable();
    this.loginForm.controls['email'].enable();
  }

  onLoginSubmit() {
    this.processing = true;
    this.disableForm();

    const user = { 
      password: this.loginForm.get('password').value,
      email: this.loginForm.get('email').value
    }

    this.authService.userLogin(user).subscribe(data => {
      if(!data.success){
        this.messageClass = "alert alert-danger";
        this.message = data.message;
        this.processing = false;
        this.enableForm(); 
      } else {
        this.messageClass = "alert alert-success";
        this.message = data.message; 
        this.authService.storeuserInFrontEnd(data.token, data.user); 
        setTimeout(() => {
          this.router.navigate(['/dashboard']); // Redirect to login view
        }, 1500);
      }
    }); 
  }


  // forgot password section

  disableForgotForm() {
    this.forgotPasswordForm.controls['new_password'].disable();
    this.forgotPasswordForm.controls['old_password'].disable();
    this.forgotPasswordForm.controls['email'].disable();
  }

  enableForgotForm() {
    this.forgotPasswordForm.controls['new_password'].enable();
    this.forgotPasswordForm.controls['old_password'].enable();
    this.forgotPasswordForm.controls['email'].enable();
  }
  creatForgotPasswordForm () {
    this.forgotPasswordForm  =  this.formBuilder.group({
      new_password : ['', Validators.required],
      email : ['', Validators.required],
      old_password : ['', Validators.required]
    });
  }



  onForgotPasswordSubmit(){

    this.processing = true;
    this.disableForgotForm();

    const user = {
      new_password: this.forgotPasswordForm.get('new_password').value,
      old_password: this.forgotPasswordForm.get('old_password').value,
      email: this.forgotPasswordForm.get('email').value
    }
    /*this.authService.fogotPasssword(user).subscribe(data => {
      if(!data.success){
        this.messageClass = "alert alert-danger";
        this.message = data.message;
        this.processing = false;
        this.enableForgotForm();
      } else {
        this.fogotPassword = false;
        this.messageClass = "alert alert-success";
        this.message = data.message;
      }
    });*/
  }

  ngOnInit() {
  }

}