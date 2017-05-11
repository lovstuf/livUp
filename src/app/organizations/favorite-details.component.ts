import { Component, OnInit } from '@angular/core';
import { Http, Response} from '@angular/http';
import { NgForm} from '@angular/forms';
import { Config } from '../common/config';
import { ApiService } from '../shared/api.service';
import { AuthGuard} from '../common/auth.guard';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Component({
  selector: 'lc-favorite-details',
  templateUrl: './favorite-details.component.html'
})
export class FavoriteDetailsComponent implements OnInit {
  MyLikedOrgs:Object; 
  private data: Observable<Response>;
  constructor(public config:Config, private apiService:ApiService, private authGuard:AuthGuard) { }
  getProfileImgURI(data){
    if(data){return this.config.mediaEndpoint+"/"+data;}else{return this.config.mediaEndpoint+"/"+this.config.defaultImage;}
  }
  ngOnInit() {
    if (this.authGuard.isLoggedIn() == true) {
      this.data = this.apiService.getMyLikedOrgs();
      this.data.subscribe(observer =>{
          if(observer.status==200){this.MyLikedOrgs = observer.json().orgSummary;}else{this.MyLikedOrgs = "";}
      });
    }
  }

}
