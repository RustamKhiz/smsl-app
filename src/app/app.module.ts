 import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AppComponent } from './app.component';
import {AutComponent} from './aut/aut.component';
import {CardComponent} from './card/card.component';
import {AppRoutingModule} from './app-routing.module';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './layouts/site-layout/site-layout.component'
import { TokenInterseptor } from './layouts/classes/token.interseptor';
import { StaffComponent } from './layouts/site-layout/staff/staff.component';
import { MajorComponent } from './layouts/site-layout/major/major.component';
import { ProfileRedComponent } from './layouts/site-layout/profile-red/profile-red.component';
import { ChartComponent } from './chart/chart.component';
 import {NgxChartsModule} from "@swimlane/ngx-charts";
 import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ReportsComponent } from './layouts/site-layout/reports/reports.component';
import {ErrorInterseptor} from '../app/layouts/classes/error.interseptor';
import { PersonalComponent } from './layouts/site-layout/personal/personal.component';
import { EquipmentComponent } from './layouts/site-layout/equipment/equipment.component'

@NgModule({
  declarations: [
    AppComponent,
    AutComponent,
    CardComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    StaffComponent,
    MajorComponent,
    ProfileRedComponent,
    ChartComponent,
    ReportsComponent,
    PersonalComponent,
    EquipmentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterseptor
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: ErrorInterseptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
