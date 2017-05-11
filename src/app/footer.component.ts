import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from './common/auth.guard';
@Component({
  selector: 'lc-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  constructor(public router: Router, private authGuard:AuthGuard) { }

  ngOnInit() {
  }

}
