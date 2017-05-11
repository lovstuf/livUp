import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../common/auth.guard';

@Component({
  selector: 'lc-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent{

  constructor(private authGuard: AuthGuard){
    this.authGuard.logout();
  }
}