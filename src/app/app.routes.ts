import { Routes } from '@angular/router';
import { Home } from './home/home';

import { Chat } from './chat';
import { Register } from './register/register';
import { Login } from './login/login';
import { LoginVehicle } from './loginvehicle/loginvehicle';
import { ServicesComponent} from './services/services';
import { Component } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard';
import { GarageService } from './garageservice';
import { GarageMapComponent } from './garage-map/garage-map';
import { RendezvousComponent } from './rendezvous/rendezvous';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';




export const routes: Routes = [
     { path: '', component: Home},        // Page d'accueil
  { path: 'home', component: Home },

  {path:'chat',component:Chat},
  {path:'register',component:Register},
  {path:'login',component:Login},
  {path:'loginvehicle',component:LoginVehicle},
   { path: 'services', component:ServicesComponent},
   {path:'dashboard',component:DashboardComponent},
   {path:'garage-map',component:GarageMapComponent},
   {path:'rendezvous',component:RendezvousComponent},
   {path:'admin-dashboard',component:AdminDashboard}



   
 

 


];
