import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyInterestsComponent } from '../partials/my-interests.component';
import { MyOrganisationsComponent } from '../partials/my-organisations.component';
import { ProfileDetailComponent } from './profile-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService} from '../shared/api.service';

@Component({
  selector: 'lc-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  Tab:boolean;
  constructor(private router: Router, private apiService:ApiService) {
    this.Tab= true;
  }
  setTab($data){
    if($data){this.Tab= false;}else{this.Tab=true;}
  }
  ngOnInit() {
  }

}
