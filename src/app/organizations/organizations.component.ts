import { Component, OnInit } from '@angular/core';
import { MyInterestsComponent } from '../partials/my-interests.component';
import { MyOrganisationsComponent } from '../partials/my-organisations.component';
import { FavoriteDetailsComponent} from './favorite-details.component';
import { OrganizationDetailsComponent } from './organization-details.component'

@Component({
  selector: 'lc-organizations',
  templateUrl: './organizations.component.html'
})
export class OrganizationsComponent implements OnInit {
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
