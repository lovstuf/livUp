import { Component, OnInit } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';
import { Http ,Headers, Response} from '@angular/http';
import { NgForm } from '@angular/forms';
import { Config } from './common/config';
import { AuthGuard } from './common/auth.guard';
import { ApiService } from './shared/api.service';
import { Router } from '@angular/router';
import { SearchComponent } from './search.component';

@Component({
  selector: 'lc-header',
  templateUrl: './header.component.html',
  providers:[SearchComponent]
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean;  Tab:boolean;
  constructor(private searchResult: SearchComponent, public http: Http, public router: Router, private authGuard : AuthGuard, public config:Config, private apiService:ApiService) {
    this.isLoggedIn = authGuard.isLoggedIn();
    //this.Tab= true;
  }

  setTab($data){
    if($data){this.Tab= false;}else{this.Tab=true;}
  }

  search(form:NgForm) {
    this.router.navigate(['/search', form.value.search]);

  }
  
  ngOnInit() {
  }

}
