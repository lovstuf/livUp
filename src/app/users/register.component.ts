import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http ,Headers} from '@angular/http';
import { Config } from '../common/config';
import { AuthGuard } from '../common/auth.guard';

declare const FB:any;
declare const AUTHTYPE:{EMAIL:"EMAIL",FACEBOOK:"FACEBOOK",GOOGLEPLUS:"GOOGLEPLUS",TWITTER:"TWITTER"};

@Component({
  selector: 'lc-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  errorMessage: string;
  constructor(private router: Router , public http: Http, public config:Config, private authGuard:AuthGuard) { 
    FB.init({
            appId      : this.config.facebookAppId,
            cookie     : false,  // enable cookies to allow the server to access
                                // the session
            xfbml      : true,  // parse social plugins on this page
            version    : this.config.facebookAppVersion // use graph api version 2.8
        });
  }
  register($event, firstname, surname, gender, email, password) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    $event.preventDefault();
    let body = JSON.stringify(
    {
      "userAccess": {
        "email": email,
        "emailAuth": {
          "password": password
        },
        "auth": "EMAIL"
      },
      "user": {
        "firstname": firstname,
        "surname": surname,
        "gender": gender
      }
    });

    ///preferences

    this.http.post(this.config.apiendpointURL+"/user/register" , body, { headers: headers })
      .subscribe(
        response => {
          console.log("DONE");
          this.router.navigate(['/login']);
        },
        error => {
          this.errorMessage = "Invalid Information";
        }
      );
  }
  onFacebookLoginClick() {
        FB.login();
  }
  statusChangeCallback(resp) {
        if (resp.status === 'connected') {
            // connect here with your server for facebook login by passing access token given by facebook\
            console.log("connected with facebook");
        }else if (resp.status === 'not_authorized') {
            console.log("Failed with facebook");
        }else {
           //this.router.navigate(['/login']); 
        }
    };
  ngOnInit() {
    if(this.authGuard.isLoggedIn()==true){
      this.router.navigate(['/feed']);
    }
     FB.getLoginStatus(response => {
            this.statusChangeCallback(response);
        });
  }

}
