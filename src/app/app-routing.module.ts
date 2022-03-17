import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterBusinessComponent } from './components/register-business/register-business.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  {path: 'register-business', component: RegisterBusinessComponent, canActivate: [AuthGuard]},
  {path: 'map-view', component: MapViewComponent},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
