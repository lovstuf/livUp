import { Injectable } from '@angular/core';
import { Http ,Headers, Response} from '@angular/http';
import { Config } from '../common/config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
  public result: Object;
  constructor(public http: Http, public config:Config) {}
  
  userProfile(){ return this.oauthRequest('/user/me','GET','','');}
  saveUserProfile(data){ return this.oauthRequest('/user/me','PUT',data,'');}
  userUploadProfileImage(data){ return this.imageUpload('/user/me/images/profile',data);}
  getMyLikedActivities(){ return this.oauthRequest('/user/me/likes/activities', 'GET','','');}
  getOrgPayment(orgid){ return this.oauthRequest('/orgs/'+orgid+'/epos', 'GET','','');}
  myLikedActivitiesCount(){ return this.oauthRequest('/user/me/likes/activities/count', 'GET','','');}
  getUserPrefs(){ return this.oauthRequest('/activities/activitykeywords','GET','','');}
  changePassword(data){ return this.oauthRequest('/user/me/changepassword','POST',data,'');}
  getLocale(){ return this.http.get('//freegeoip.net/json/');}
  newOrg(data){ return this.oauthRequest('/orgs','POST',data,'');}
  getOrg(oid){ if(!oid || oid == 'undefined') return null; return this.oauthRequest('/orgs/' + oid+'/secure', 'GET','','');}
  getOrgAnonymous(oid){ if(!oid || oid == 'undefined') return null; return this.oauthRequest('/orgs/' + oid, 'GET','','');}
  updateOrg(oid, data){ if(!oid || oid == 'undefined') return null; return this.oauthRequest('/orgs/' + oid, 'PUT', data,'');}
  orgUploadProfileImage(id, data){ if (!id || id == 'undefined') return null; return this.imageUpload('/orgs/' + id + '/images/profile', data)}
  orgAddPaymentAccount(id, data){ if (!id || id == 'undefined') return null; return this.oauthRequest('/orgs/' + id + '/epos', 'POST', data,'');}
  orgEditPaymentAccount(id, eposId, data){ if (!id || id == 'undefined') return null; return this.oauthRequest('/orgs/' + id + '/epos/'+eposId, 'PUT', data,'');}
  getMyLikedOrgs(){ return this.oauthRequest('/user/me/likes/orgs','GET','','');}
  getMyOrgs(){ return this.oauthRequest('/user/me/admins/orgs','GET','','');}
  getOrgLikesCount(oid){ return this.oauthRequest('/orgs/' + oid + '/likers/count', 'GET','','');}
  getOrgMembersCount(oid){ return this.oauthRequest('/orgs/' + oid + '/members/count', 'GET','','');}
  getOrgActivitiesCount(oid){ return this.oauthRequest('/orgs/' + oid + '/activities/current/count', 'GET','','');}
  getOrgActivities(oid){ return this.oauthRequest('/orgs/' + oid + '/activities', 'GET','','');}
  orgCreateStatus(oid, data, image){
    var headers = {
      'Content-Type': undefined,
    };
    var formData = new FormData();
    //var statusUpdate = new Blob([angular.toJson(d)], { type: "application/json"});
    //   formData.append("status",statusUpdate);
    //   if(image!==null)
    //   formData.append("upload",image);
    return this.oauthRequest('/orgs/' + oid + '/status', 'POST', formData, headers);
  }
  getFeed(){ return this.oauthRequest('/user/me/feed','GET','','');}
  getOrgFeed(oid){ return this.oauthRequest('/orgs/' + oid + '/feed','GET','',''); }
  search(term){ return this.oauthRequest('/search?term=' + term, 'GET','','');}
  geoSearch(lat,lon){ return this.oauthRequest('/search/geo?lat=' + lat+'&lon='+lon, 'GET','','');}
  newActivity(data){ return this.oauthRequest('/activities', 'POST', data,'');}
  updateActivity(aid, data){ return this.oauthRequest('/activities/' + aid, 'PUT', data,'');}
  getActivity(aid){ return this.oauthRequest('/activities/' + aid + '/secure', 'GET','','');}
  getActivityAnonymous(aid){ return this.oauthRequest('/activities/' + aid, 'GET','','');}
  activityUploadStatusImage(id, data){ return this.imageUpload('/activities/' + id + '/images/status', data);}
  activityCreateStatus(aid, data,image){ 
    var headers = {
      'Content-Type': undefined,
    };
    var formData = new FormData();
    //var statusUpdate = new Blob([angular.toJson(data)], { type: "application/json"});
    //formData.append("status",statusUpdate);
    if(image!==null)
      formData.append("upload",image);
    return this.oauthRequest('/activities/' + aid + '/status', 'POST', formData, headers); 
  }
  getActivityFeed(aid){ return this.oauthRequest('/activities/' + aid + '/feed', 'GET','',''); }
  getActivityLikesCount(aid){ return this.oauthRequest('/activities/' + aid + '/likers/count', 'GET','',''); }
  activityEnrol(d){  if (!d) {return;} return this.oauthRequest('/billing/enrol', 'POST', d,''); }
  getActivityAmIEnrolled(aid){  if (!aid) {return;} return this.oauthRequest('/user/me/enrolments/' + aid, 'GET','',''); }
  likeActivity(id){ if(!id) {return false;} return this.oauthRequest('/user/me/likes/activities/' + id, 'PUT','',''); }
  likeOrg(id){ if(!id) {return false;}  return this.oauthRequest('/user/me/likes/orgs/' + id, 'PUT','',''); }
  enroll(d){ if (!d) {return false;} return this.oauthRequest('/billing/enrol', 'POST', d,''); }
  completeEnrollment(d){ if (!d) {return false;} return this.oauthRequest('/billing/enrol', 'POST', '',''); }
  rejectEnrollment(d){ if (!d) {return false;} return this.oauthRequest('/billing/enrol', 'POST', '',''); }
  activityUploadProfileImage(d){ if (!d) {return false;} return this.oauthRequest('/billing/enrol', 'POST', '',''); }

  oauthRequest(path,method,data,headers): Observable<Response> {
    headers = headers || {};
    headers['X-UserId'] = localStorage.getItem("userId");
    headers['Authorization'] = 'Bearer ' + localStorage.getItem("tokenKey");

    if (!headers['Accept']){
      headers['Accept'] = 'application/json';
      headers['X-ClientType'] = 'web';
    }
    if(method == "POST"){
        return this.http.post(this.config.apiendpointURL+path, data, { headers: headers });
    }
    else if(method == "GET"){
        return this.http.get(this.config.apiendpointURL+path, { headers: headers });
    }
    else if(method == "PUT"){
        return this.http.put(this.config.apiendpointURL+path, data, { headers: headers });
    }
  }

  imageUpload(url, data) {
    var headers = {
      'Content-Type': 	undefined,
    };
    return this.oauthRequest(url, 'POST', data, headers);
  }

}
