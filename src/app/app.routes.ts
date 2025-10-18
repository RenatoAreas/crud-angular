import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home/home.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' }
];
