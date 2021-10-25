import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutComponent } from './aut/aut.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AutGuard } from './layouts/classes/aut.guard';
import { SiteLayoutComponent } from './layouts/site-layout/site-layout.component';
import {StaffComponent} from "./layouts/site-layout/staff/staff.component";
import {MajorComponent} from "./layouts/site-layout/major/major.component";
import {ProfileRedComponent} from "./layouts/site-layout/profile-red/profile-red.component";
import {ReportsComponent} from "./layouts/site-layout/reports/reports.component";
import {ReportsListComponent} from "./layouts/site-layout/reports/reports-list/reports-list/reports-list.component";
import {ReportsAddComponent} from "./layouts/site-layout/reports/reportsAdd/reports-add/reports-add.component";
import {EquipmentComponent} from "./layouts/site-layout/equipment/equipment.component";
import { PersonalComponent } from './layouts/site-layout/personal/personal.component';
import { ReportsRedComponent } from './layouts/site-layout/reports/reports-red/reports-red.component';
import { ReportViewComponent } from './layouts/site-layout/reports/report-view/report-view.component';


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
        path: 'site', component: MajorComponent
      },
      {
        path: 'major', component: MajorComponent
      },
      {
        path: 'staff', component: StaffComponent
      },
      {
        path: 'profile', component: ProfileRedComponent
      },
      {
        path: 'reports', component: ReportsComponent, children: [
        {
          path: 'list', component: ReportsListComponent
        },
        {
          path: 'add-report', component: ReportsAddComponent
        },
        {
          path: 'red-report', component: ReportsRedComponent
        },
        {
          path: 'view-report', component: ReportViewComponent
        }
        ]
      },
      {
        path: 'equipment', component: EquipmentComponent
      },
      {
        path: 'personal', component: PersonalComponent
      }
    ]
  }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
