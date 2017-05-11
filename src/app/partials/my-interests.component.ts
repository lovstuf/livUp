import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../common/auth.guard';
import { Http, Response} from '@angular/http';
import { Config } from '../common/config';
import { ApiService } from '../shared/api.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
@Component({
  selector: 'lc-my-interests',
  templateUrl: './my-interests.component.html'
})
export class MyInterestsComponent implements OnInit {
  UserPrefs:Object;
  private data: Observable<Response>;
  constructor(private authGuard : AuthGuard,public config:Config, private apiService:ApiService ) { }
  toggleInterestFilter(event){
    console.log(event);
    // this.data = this.apiService.getUserPrefs();
    // this.data.subscribe(observer =>{
    //     this.UserPrefs= observer.json().tag; 
    //     //console.log(this.UserPrefs);
    //});
  }
  ngOnInit() {
    if(this.authGuard.isLoggedIn()==true){
      this.data = this.apiService.getUserPrefs();
      this.data.subscribe(observer =>{
          this.UserPrefs= observer.json().tag; 
          //console.log(this.UserPrefs);
      });
    }
  }
  
}
