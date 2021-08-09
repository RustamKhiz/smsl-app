import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import {AutComponent} from './aut/aut.component';
import {CardComponent} from './card/card.component';
import {AppRoutingModule} from './app-routing.module';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './layouts/site-layout/site-layout.component'
import { TokenInterseptor } from './layouts/classes/token.interseptor';
import { StaffComponent } from './layouts/site-layout/staff/staff.component';
import { MajorComponent } from './layouts/site-layout/major/major.component';



@NgModule({
  declarations: [
    AppComponent,
    AutComponent,
    CardComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    StaffComponent,
    MajorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterseptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
