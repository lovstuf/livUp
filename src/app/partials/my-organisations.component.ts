import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { AuthGuard } from '../common/auth.guard';
import { ApiService } from '../shared/api.service';
import { Config } from '../common/config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Component({
  selector: 'lc-my-organisations',
  templateUrl: './my-organisations.component.html'
})
export class MyOrganisationsComponent implements OnInit {
  getMyOrgs:Object;
  private data: Observable<Response>;
  constructor(private authGuard:AuthGuard, private apiService: ApiService, private config:Config) { }
  
  getProfileImgURI(data){
    if(data){return this.config.mediaEndpoint+"/"+data;}else{return this.config.mediaEndpoint+"/"+this.config.defaultImage;}
  }

  ngOnInit() {
    if(this.authGuard.isLoggedIn()==true){
      this.data = this.apiService.getMyOrgs();
      this.data.subscribe(observer => {
        if( observer.status==200 ){this.getMyOrgs = observer.json().orgSummary;}else{this.getMyOrgs = "";}
      });
    }
  }

}
