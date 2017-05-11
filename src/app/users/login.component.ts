import { Component, OnInit, Provider } from '@angular/core';
import { Router} from '@angular/router';
import { Http ,Headers} from '@angular/http';
import { Config } from '../common/config';
import { AuthGuard } from '../common/auth.guard';

declare const FB:any;
let headers = new Headers();

@Component({
  selector: 'lc-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  constructor(private router: Router , public http: Http, public authGuard : AuthGuard, public config:Config) {
    this.errorMessage = this.authGuard.errorMessage;
    FB.init({
            appId      : this.config.facebookAppId,
            cookie     : false,  // enable cookies to allow the server to access
                                // the session
            xfbml      : true,  // parse social plugins on this page
            version    : this.config.facebookAppVersion // facebook app version
        });
  }
  login( login, password){
    this.authGuard.login( login, password);
    this.errorMessage = this.authGuard.errorMessage;
  }
  onFacebookLoginClick() {
        FB.login();
  }
  statusChangeCallback(resp) {
        if (resp.status === 'connected') {
            
            // connect here with your server for facebook login by passing access token given by facebook\
            console.log("connected with facebook");
            var formData = {
            'facebookId' : resp.authResponse.userID,
            'fbAccessToken':  resp.authResponse.accessToken
            };
            //headers.append('Content-Type', 'application/json');
            //headers.append('X-FBAccessToken', resp.authResponse.accessToken);
            //console.log(headers);
            let body = JSON.stringify({formData});
            this.http.post(this.config.apiLoginURL, body, { headers: headers })
              .subscribe(
                response => {
                  //localStorage.removeItem('id_token');
                  localStorage.setItem('tokenKey', response.json().tokenKey);
                  localStorage.setItem('expiresIn', response.json().expiresIn);
                  localStorage.setItem('tokenType', response.json().tokenType);
                  localStorage.setItem('issuedAt', response.json().issuedAt);
                  //localStorage.setItem('userId', response.json().headers('X-UserId'));
                  this.router.navigate(['/feed']);
                },
                error => {
                  this.errorMessage = "Invalid email or/and password.";
                  //console.log(error.text());
                }
              );
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

