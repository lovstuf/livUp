import { RouterModule ,Routes }   from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { LandingComponent } from './landing.component';
import { LoginComponent } from './users/login.component';
import { RegisterComponent } from './users/register.component';
import { LogoutComponent } from './users/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingComponent } from './profile/setting.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { OrganizationDetailByIdComponent} from './organizations/organization-detail-by-id.component';
import { ActivitesComponent} from './activites/activites.component';
import { AuthGuard } from './common/auth.guard';
import { SearchComponent } from './search.component';

export const routes: Routes = [
  { path: '',       component: LandingComponent, },
  { path: 'login',  component: LoginComponent,  },
  { path: 'logout',  component: LogoutComponent },
  { path: 'register', component: RegisterComponent, },
  { path: 'feed', component: FeedComponent, canActivate: [AuthGuard] },
  { path: 'my/organizations', component: OrganizationsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'setting', component: SettingComponent, canActivate: [AuthGuard] },
  { path: 'organizations/:id', component: OrganizationDetailByIdComponent },
  { path: 'activites/:id', component: ActivitesComponent },
  { path: 'search/:id', component: SearchComponent, canActivate: [AuthGuard] },
  { path: '**',     component: LoginComponent , }
];