import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutComponent } from './aut/aut.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AutGuard } from './layouts/classes/aut.guard';
import { SiteLayoutComponent } from './layouts/site-layout/site-layout.component';

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/aut', pathMatch: 'full'},
      {path: 'aut', component: AutComponent}
    ]
    
  },
  {
    path: '', component: SiteLayoutComponent, canActivate:[AutGuard], children: [
      {
        path: 'site', component: SiteLayoutComponent
      }
    ]
  }
      
    
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
