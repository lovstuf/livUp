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
  selector: 'lc-organization-details',
  templateUrl: './organization-details.component.html'
})
export class OrganizationDetailsComponent implements OnInit {
  myLikedActivities:Object; myLikedActivitiesCounts:Object; loc:Object; MyLikedOrgs:Object; MyOrgs:Object; status:string; error:string; lat:number;lon:number;
  private data: Observable<Response>;
  constructor(public config:Config, private apiService:ApiService, public authGuard:AuthGuard) {
    this.status = "false"; 
    this.error = "false";
   }
  onSubmit(form:NgForm){
    form.value.adminId = [localStorage.getItem('userId')];
    form.value.location = { "lat": this.lat, "lon": this.lon   };    
    form.value.contact = { "telephone":form.value.telephone, "email": form.value.email   }; 
    delete form.value.email;
    delete form.value.telephone;             
    console.log(form.value);
    this.data = this.apiService.newOrg(form.value);
    this.data.subscribe(observer =>{
        if(observer.status == 201){ 
            this.status = "Successfully Created";
            form.controls["name"].reset();
            form.controls["address"].reset();
            form.controls["email"].reset();
            form.controls["telephone"].reset();
        }else{
            this.status="false";
            this.error= "Error";}
    });
  }

  getProfileImgURI(data){
      if(data){return this.config.mediaEndpoint+"/"+data;}else{return this.config.mediaEndpoint+"/"+this.config.defaultImage;}
  }
   
  ngOnInit() {
      if (this.authGuard.isLoggedIn() == true) {
          this.data = this.apiService.getMyLikedActivities();
          this.data.subscribe(observer => {
              this.myLikedActivities = observer.json();
              //console.log(this.myLikedActivities);
          });

          this.data = this.apiService.myLikedActivitiesCount();
          this.data.subscribe(observer => {
              this.myLikedActivitiesCounts = observer.json();
              //console.log(this.myLikedActivitiesCounts);
          });
          this.data = this.apiService.getMyOrgs();
          this.data.subscribe(observer => {
              if(observer.status==200){this.MyOrgs = observer.json().orgSummary;}else{this.MyOrgs = "";}
          });
          this.data = this.apiService.getLocale();
          this.data.subscribe(observer => {
              this.lat = observer.json().latitude;
              this.lon = observer.json().longitude;
          });
      }
  }

}
