import { Injectable } from '@angular/core';
import { Router, CanActivate , Route } from '@angular/router';
import { Http ,Headers, Response} from '@angular/http';
import { Config } from './config';
import { ApiService} from '../shared/api.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
declare const FB:any;
let headers = new Headers();

@Injectable()
export class AuthGuard implements CanActivate {
  private loggedIn = false;
  errorMessage: string;
  userProf : Object;
  userProfileData : Object; firstname: string; surname:string; profileImage: string; gender: string; bio: string; userId:string; userAccessId:string;
  whoSeesMyPosts: string; whoSeesMyPictures:string; whoSeesMyVideos:string;
  private data: Observable<Response>;
  constructor(private router: Router , public http: Http, public config: Config, private apiService:ApiService ) {
    this.loggedIn = !!localStorage.getItem('tokenKey');
    this.userProfile();   
  }
  canActivate() {
    // Check to see if a user has a valid JWT
    if (this.loggedIn) {
      // If they do, return true and allow the user to load the home component
      return true;
    }
      // If not, they redirect them to the login page
      this.router.navigate(['/login']);
      return false;
  }
  login( email, password) {
    headers.append('Content-Type', 'application/json');
    //event.preventDefault();
    let body = JSON.stringify({ email, password });
    this.http.post(this.config.apiLoginURL, body, { headers: headers })
      .subscribe(
        response => {
          var res  = JSON.stringify(response.headers);
          res = res.replace("X-UserId", "X_UserId");
          var data_object = JSON.parse(res);
          localStorage.setItem('tokenKey', response.json().tokenKey);
          localStorage.setItem('expiresIn', response.json().expiresIn);
          localStorage.setItem('tokenType', response.json().tokenType);
          localStorage.setItem('issuedAt', response.json().issuedAt);
          localStorage.setItem('userId', data_object.X_UserId[0]);
          this.loggedIn = true;
          this.userProfile(); 
          this.router.navigate(['/feed']);
        },
        error => {
          this.errorMessage = "Invalid email or/and password.";
        }
      );
  }

  logout() {
    localStorage.removeItem('tokenKey');
    localStorage.removeItem('tokenKey');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('issuedAt');
    localStorage.removeItem('userId');
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  userProfile(){
    if(this.isLoggedIn()==true){
      this.data = this.apiService.userProfile();
      this.data.subscribe(observer =>{
          //console.log(observer.json());
          this.userProfileData = observer.json(); 
          if(observer.json().hasOwnProperty('profileImgURI')){
            this.profileImage = this.config.mediaEndpoint+"/"+observer.json().profileImgURI;
          }else{
            this.profileImage = this.config.mediaEndpoint+"/"+this.config.defaultImage;
          }
          if(observer.json().hasOwnProperty('firstname')){this.firstname = observer.json().firstname;}else{this.firstname = "";}
          if(observer.json().hasOwnProperty('surname')){this.surname = observer.json().surname;}else{this.surname = "";}
          if(observer.json().hasOwnProperty('gender')){this.gender = observer.json().gender;}else{this.gender = "";}
          if(observer.json().hasOwnProperty('bio')){this.bio = observer.json().bio;}else{this.bio = "";}
          if(observer.json().hasOwnProperty('userAccessId')){this.userAccessId = observer.json().userAccessId;}else{this.userAccessId = "";}
          if(observer.json().hasOwnProperty('userId')){this.userId = observer.json().userId;}else{this.userId = "";}
          if(observer.json().hasOwnProperty('whoSeesMyPosts')){this.whoSeesMyPosts = observer.json().whoSeesMyPosts;}else{this.whoSeesMyPosts = "";}
          if(observer.json().hasOwnProperty('whoSeesMyPictures')){this.whoSeesMyPictures = observer.json().whoSeesMyPictures;}else{this.whoSeesMyPictures = "";}
          if(observer.json().hasOwnProperty('whoSeesMyVideos')){this.whoSeesMyVideos = observer.json().whoSeesMyVideos;}else{this.whoSeesMyVideos = "";}
      });
    }
  }

}
