import { Component, OnInit } from '@angular/core';
import { Http, Response} from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'lc-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  constructor(private router: Router) { }
  ngOnInit() {
    
  }

}