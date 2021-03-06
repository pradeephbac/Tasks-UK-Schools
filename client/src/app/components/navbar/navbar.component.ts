import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router, private _flashMessagesService: FlashMessagesService) {
   }

  onLogout() {
    this.authService.userLogOut();
    this._flashMessagesService.show('You are just logged out', {cssClass : 'alert-info'});
    this.router.navigate(['/']);
  }

  ngOnInit() { 
  }

}