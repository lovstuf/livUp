import { Component, OnInit } from '@angular/core';
import { MyInterestsComponent } from '../partials/my-interests.component';
import { MyOrganisationsComponent } from '../partials/my-organisations.component';
import { ProfileDetailComponent } from './profile-detail.component';

@Component({
  selector: 'lc-setting',
  templateUrl: './setting.component.html'
})
export class SettingComponent implements OnInit {
  Tab:boolean;
  constructor() {
    this.Tab= false;
   }
  setTab($data){
    if($data){this.Tab= false;}else{this.Tab=true;}
  }
  
  ngOnInit() {
  }

}
