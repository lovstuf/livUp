import { Component,ViewChild, OnInit } from '@angular/core';
import { Http, Response} from '@angular/http';
import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import { NgForm } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { AuthGuard} from '../common/auth.guard';
import { Config } from '../common/config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Component({
  selector: 'lc-profile-detail',
  templateUrl: './profile-detail.component.html'
})
export class ProfileDetailComponent implements OnInit {
  private data: Observable<Response>; private fileReader: FileReader;
  private editing = false;
  data2:any;
  file:File;
  cropperSettings2:CropperSettings;
  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
  constructor(private config:Config, private apiService:ApiService, private authGuard:AuthGuard) {
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

  cropped(bounds:Bounds) {
     //console.log(bounds);
  }
  /**
   * Used to send image to second cropper
   * @param $event
   */
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
  onEditing(){
    this.editing = !this.editing;
  }

  onSubmit(form:NgForm){
      form.value.userId = this.authGuard.userId;
      form.value.userAccessId = this.authGuard.userAccessId;
      this.data = this.apiService.saveUserProfile(form.value);
      this.data.subscribe(observer =>{
          //console.log(observer);
          if(observer.ok==true){
              this.editing = false;
          }
      });
  }
 
  ngOnInit() {
      
  }
 

}
