import { Component, OnInit } from '@angular/core';
import { Http, Response} from '@angular/http';
import { NgForm } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { Config } from '../common/config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
@Component({
  selector: 'lc-account',
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
   userProfileData : Object;
  firstname: string; surname:string; profileImage: string; gender: string; bio: string; userId:string; userAccessId:string;
  whoSeesMyPosts: string; whoSeesMyPictures:string; whoSeesMyVideos:string;
  string; error: string; data: string; status:string; private res: Observable<Response>;
  constructor(private config:Config, private apiService:ApiService) { 
    this.status = "false"; 
    this.error = "false";
  }
  onSubmit(form:NgForm){
    this.data = '{"old":"'+form.value.old+'","newPass":"'+form.value.newPass+'"}';
    this.res = this.apiService.changePassword(JSON.parse(this.data));
    this.res.subscribe(observer =>{
          if(observer.status==200){ this.status ="Successfully Password Changed";}
      },
      onerror=>{
            this.error = "Error";
      });
  }
  savePrivacySetting(form:NgForm){
      form.value.userId = this.userId;
      form.value.userAccessId = this.userAccessId;
      this.res = this.apiService.saveUserProfile(form.value);
      this.res.subscribe(observer =>{
          //console.log(observer);
      });
  }
  ngOnInit() {
    this.res = this.apiService.userProfile();
    this.res.subscribe(observer =>{
        this.userProfileData = observer.json(); 
        this.firstname = observer.json().firstname;
        this.profileImage = this.config.mediaEndpoint+"/"+observer.json().profileImgURI;
        this.surname = observer.json().surname;
        this.gender = observer.json().gender;
        this.bio = observer.json().bio;
        this.userAccessId = observer.json().userAccessId;
        this.userId = observer.json().userId;
        this.whoSeesMyPosts = observer.json().whoSeesMyPosts;
        this.whoSeesMyPictures = observer.json().whoSeesMyPictures;
        this.whoSeesMyVideos = observer.json().whoSeesMyVideos;
        //console.log(this.whoSeesMyPosts);
    });
  }

}
