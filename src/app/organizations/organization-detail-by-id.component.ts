import { Component, ViewChild, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Config } from '../common/config';
import { ApiService } from '../shared/api.service';
import { AuthGuard } from '../common/auth.guard';
import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { MyInterestsComponent } from '../partials/my-interests.component';
import { MyOrganisationsComponent } from '../partials/my-organisations.component';

@Component({
  selector: 'lc-organization-detail-by-id',
  templateUrl: './organization-detail-by-id.component.html'
})

export class OrganizationDetailByIdComponent implements OnInit {
  orgImage: string; id:string; userId: string; isOwner:Object; eposId:string; status:string; orgActivities:Object; MyOrgs:Object;
  isLoggedIn: boolean; eventType:boolean; priceStatus:boolean; private editingOrg = false; selectedCurrency:string; 
  getOrg:Object; UserPrefs:Object; currencies:Object;
  private data: Observable<Response>;
  lat:number;lon:number;
  data2:any;
  file:File;
  cropperSettings2:CropperSettings;
  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
  constructor(public config:Config, private apiService:ApiService, private router: Router, private route: ActivatedRoute, private authGuard : AuthGuard) {
    this.eventType = true; this.priceStatus= true;
    this.isLoggedIn = authGuard.isLoggedIn();
    this.id = route.snapshot.params['id'];
    this.userId =  localStorage.getItem('userId');
    this.status = "false";
    //Cropper settings 2
    this.cropperSettings2 = new CropperSettings();
    this.cropperSettings2.width = 200;
    this.cropperSettings2.height = 200;
    this.cropperSettings2.keepAspect = false;

    this.cropperSettings2.croppedWidth = 200;
    this.cropperSettings2.croppedHeight = 200;

    this.cropperSettings2.canvasWidth = 500;
    this.cropperSettings2.canvasHeight = 300;

    this.cropperSettings2.minWidth = 100;
    this.cropperSettings2.minHeight = 100;

    this.cropperSettings2.rounded = true;
    this.cropperSettings2.minWithRelativeToResolution = false;

    this.cropperSettings2.cropperDrawSettings.strokeColor = 'rgba(255,125,125,1)';
    this.cropperSettings2.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings2.noFileInput = true;

    this.data2 = {};
  }

  eventT(){
    this.eventType= !this.eventType;
  }
  priceStat(){
    this.priceStatus= !this.priceStatus;
  }
  toggleDay(){

  }

  getProfileImgURI(data){
      if(data){return this.config.mediaEndpoint+"/"+data;}else{return this.config.mediaEndpoint+"/"+this.config.defaultImage;}
  }

  likeOrg(id){
    console.log(id);
  }

  edit(){this.editingOrg = !this.editingOrg;}

  cancel(){this.editingOrg = false;}

  saveOrg(form:NgForm){
    form.value.id = this.id;
    form.value.adminId = [localStorage.getItem('userId')];
    form.value.contact = { "telephone":form.value.telephone, "email": form.value.email   };
    delete form.value.email;
    delete form.value.telephone;
    this.data = this.apiService.updateOrg(this.id,form.value);
    this.data.subscribe(observer =>{
      if(observer.ok == true){ 
        this.editingOrg = false;
      }else{
        this.status="Error";
      }
    }); 
  }

  saveActivity(form:NgForm){
    form.value.adminId = [localStorage.getItem('userId')];
    form.value.location = { "lat": this.lat, "lon": this.lon   }; 
    if(form.value.date){
      form.value.oneDayDetails = { "date":form.value.date, "fromTime": form.value.fromTime, "toTime": form.value.toTime};
    }
    if(form.value.amount!=""){
      form.value.price = [{"amount":form.value.amount,"description": "Adult","currency": form.value.currency}];
    }
    if(form.value.tag != ""){
      form.value.tag = [form.value.tag];
    }
    delete form.value.date;
    delete form.value.fromTime;
    delete form.value.toTime;
    delete form.value.amount;
    delete form.value.currency;
    delete form.value.tag;
    //console.log(form.value);
    this.data = this.apiService.newActivity(form.value);
    this.data.subscribe(observer =>{
      //console.log(observer);
      if(observer.ok==true){
        this.status = "Successfully Added";
      }
    });
     
  }
  
  viewAll(){

  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        let formData:FormData = new FormData();
        formData.append('uploadFile', file, file.name);
        console.log(formData);
        // let headers = new Headers();
        // headers.append('Content-Type', 'multipart/form-data');
        // headers.append('Accept', 'application/json');
        // let options = new RequestOptions({ headers: headers });
    }
}

  addAStatus(form:NgForm){
    console.log(form.value);
  }

  onSubmit(form:NgForm){
    //console.log(form.value);
    if(form.value.status == "add"){
     var data3 = {
        type: 'PAYPAL',
        optionFields: [{
          field: 'paypalEmail',
          value: form.value.email
        }]
      };
      this.data = this.apiService.orgAddPaymentAccount(this.id, data3);
      this.data.subscribe(observer =>{
        if(observer.ok==true){
          //console.log(this.isOwner);
          this.status = "Successfully Added";
        }
      });
    }else{

      this.data = this.apiService.getOrgPayment(this.id);
      this.data.subscribe(observer =>{
        if(observer.ok == true){
          this.eposId = observer.json().option[0].id;
          var data3 = {
            id: this.eposId,
            type: 'PAYPAL',
            optionFields: [{
              field: 'paypalEmail',
              value: form.value.email
            }]
          };
          this.data = this.apiService.orgEditPaymentAccount(this.id, this.eposId, data3);
          this.data.subscribe(observer =>{
            if(observer.ok== true){
              //console.log(observer);
              this.status = "Successfully Updated";
            }
          });
        }
      });
     
      
    }
  }

  cropped(bounds:Bounds) {
     //console.log(bounds);
  }

  fileChangeListener($event) {
      var image:any = new Image();
      this.file = $event.target.files[0];
      var myReader:FileReader = new FileReader();
      var that = this;
      myReader.onloadend = function (loadEvent:any) {
          image.src = loadEvent.target.result;
          that.cropper.setImage(image);
      };
      myReader.readAsDataURL(this.file);

  }

  uploadImg(){
    this.file.name;
    console.log(this.file); 
    var fb:any = this.file.name;
    // var formData = new FormData();
    // formData.append('upload', this.file, this.file.type);
    // this.data = this.apiService.userUploadProfileImage(this.file);
    // this.data.subscribe(observer =>{
    //       console.log(observer);
    //   });
  }

  ngOnInit() {
    if(this.authGuard.isLoggedIn()==true){
      if(this.id){
        this.data = this.apiService.getOrg(this.id);
        this.data.subscribe(observer =>{
          if(observer.ok==true){
            this.getOrg= [observer.json()];
            this.isOwner = observer.json().adminId.indexOf(this.userId) > -1;
            if(observer.json().profileImgURI){
              this.orgImage = this.getProfileImgURI(observer.json().profileImgURI);
            }else{
              this.orgImage = this.getProfileImgURI('');
            }
          }
        });
        
        this.data = this.apiService.getOrgActivities(this.id);
        this.data.subscribe(observer =>{
          if(observer.status==200){
            this.orgActivities = observer.json().activitySummaries;
          }
        });
      }else{
        this.getOrg = "Error";
      }

      this.data = this.apiService.getMyOrgs();
      this.data.subscribe(observer => {
        this.MyOrgs = observer.json().orgSummary;
      });

      this.data = this.apiService.getUserPrefs();
      this.data.subscribe(observer =>{
          this.UserPrefs= observer.json().tag; 
          console.log(this.UserPrefs);
      });
    }else{
      if(this.id){
        this.data = this.apiService.getOrgAnonymous(this.id);
        this.data.subscribe(observer =>{
          console.log(observer.json());
          if(observer.ok==true){
            this.getOrg= [observer.json()];
            this.isOwner = "";
            if(observer.json().profileImgURI){
              this.orgImage = this.getProfileImgURI(observer.json().profileImgURI);
            }else{
              this.orgImage = this.getProfileImgURI('');
            }
          }
        });
        
        this.data = this.apiService.getOrgActivities(this.id);
        this.data.subscribe(observer =>{
          if(observer.status==200){
            this.orgActivities = observer.json().activitySummaries;
          }
        });
      }else{
        this.getOrg = "Error";
      }
    }

    this.currencies = ["EUR","USD","GBP","AUD","NZD","CHR"];
    this.data = this.apiService.getLocale();
    this.data.subscribe(observer =>{
        this.lat = observer.json().latitude;
        this.lon = observer.json().longitude;
    });
  }

}
