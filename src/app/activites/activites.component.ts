import { Component, OnInit} from '@angular/core';
import { Http ,Headers, Response} from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Config } from '../common/config';
import { AuthGuard } from '../common/auth.guard';
import { ApiService } from '../shared/api.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { MyInterestsComponent } from '../partials/my-interests.component';
import { MyOrganisationsComponent } from '../partials/my-organisations.component';

@Component({
  selector: 'lc-activites',
  templateUrl: './activites.component.html'
})
export class ActivitesComponent implements OnInit {
  id:string; 
  getActivity:Object; getActProfileImgURI:Object; price:Object; tag:Object;
  private data: Observable<Response>;
  days = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];
  selectedDays = [false,false,false,false,false,false,false];
  constructor(public router: Router, private route: ActivatedRoute, private authGuard : AuthGuard, public config:Config, private apiService:ApiService) {
    this.id = route.snapshot.params['id'];
  }
  getProfileImgURI($data){
      if($data){return this.config.mediaEndpoint+"/"+$data;}else{return this.config.mediaEndpoint+"/"+this.config.defaultImage;}
  }

  toggleDay(index) {
      this.selectedDays[index] = !this.selectedDays[index];
  }

  ngOnInit() {
    if(this.authGuard.isLoggedIn()==true){
      this.data = this.apiService.getActivity(this.id);
      this.data.subscribe(observer =>{
          this.getActivity= [observer.json()];
          this.getActProfileImgURI= observer.json().profileImgURI;
          if(observer.json().price[0].amount>0){
            this.price = observer.json().price;
            //console.log(this.price);
          }else{ this.price="";}
          if(observer.json().tag)
          {
            this.tag = observer.json().tag;
            //console.log(this.tag);
          }else { this.tag=""; }
          //console.log(this.getActivity);
          if (this.getActivity[0].term.repeats == "WEEKLY") {
            for (let day in this.getActivity[0].term.days){
                this.selectedDays[this.days.indexOf(this.getActivity[0].term.days[day].day)]=true;
            }
          }
      });
    }else{
      this.data = this.apiService.getActivityAnonymous(this.id);
      this.data.subscribe(observer =>{
          this.getActivity= [observer.json()];
          this.getActProfileImgURI= observer.json().profileImgURI;
          if(observer.json().price){
            this.price = observer.json().price;
            //console.log(this.price);
          }else{ this.price="";}
          if(observer.json().tag)
          {
            this.tag = observer.json().tag;
            //console.log(this.tag);
          }else { this.tag=""; }
          //console.log(this.getActivity);
          if (this.getActivity[0].term.repeats == "WEEKLY") {
            for (let day in this.getActivity[0].term.days){
                this.selectedDays[this.days.indexOf(this.getActivity[0].term.days[day].day)]=true;
            }
          }
      });
      
    }
  }

}
