import { Component, OnInit } from '@angular/core';
import { Http, Response} from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Config } from './common/config';
import { AuthGuard } from './common/auth.guard';
import { ApiService } from './shared/api.service';
import { MyInterestsComponent } from './partials/my-interests.component';
import { MyOrganisationsComponent } from './partials/my-organisations.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
@Component({
  selector: 'lc-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  isSearch: boolean; lat: number; lon: number; getFeedLength:number;
  defaultImageUrl: string; searchError:string; id:string; 
  getFeed: Object; myLikedActivities: Object;
  userProfile : Object;
  firstname: string; searchHits: Object;
  private data: Observable<Response>; private res: Observable<Response>;
  constructor(public router: Router, private route: ActivatedRoute, private authGuard : AuthGuard, public config:Config, private apiService:ApiService){
    this.id = route.snapshot.params['id'];
  }
  search(data) {
    this.data = this.apiService.search(data);
    this.data.subscribe(observer =>{
       //console.log(observer.json());
       if(observer.json().hits.total==0)
       {
          this.geoSearch();
       }else
       {
          this.isSearch = true;
          this.getFeed = observer.json().hits.hits; 
          this.getFeedLength = observer.json().hits.length;
          console.log(this.getFeed);
       }
    });
  }

  geoSearch(){ 
    this.data = this.apiService.getLocale();
    this.data.subscribe(observer =>{
      this.lat = observer.json().latitude;
      this.lon = observer.json().longitude;
      this.res = this.apiService.geoSearch(this.lat,this.lon);
        this.res.subscribe(observer =>{
          if(observer.json().hits.total==0){
            this.searchError = "Not Found";
            this.isSearch = false;
          }else{
            this.isSearch = true;
            this.getFeed = observer.json().hits.hits; 
            this.getFeedLength = observer.json().hits.length;
            console.log(this.getFeed);
          }
      }); 

    });  
  }
  getProfileImgURI(data){
      if(data){return this.config.mediaEndpoint+"/"+data;}else{return this.config.mediaEndpoint+"/"+this.config.defaultImage;}
  }

  ngOnInit() {
    if(this.authGuard.isLoggedIn()==true){
      if(this.id){
        console.log(this.id);
        this.search(this.id);
      }
      this.data = this.apiService.getMyLikedActivities();
      this.data.subscribe(observer =>{
          this.myLikedActivities= observer.json(); 
          //console.log(this.myLikedActivities);
      });
    }
  }

}
