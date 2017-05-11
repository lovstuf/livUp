import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule, NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'lc-root',
  templateUrl: './livup-co.component.html'
})
export class AppComponent {
  constructor(public router: Router) {}
}
