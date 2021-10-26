import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatSelectInfiniteScrollModule} from 'ng-mat-select-infinite-scroll';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatTabsModule} from '@angular/material/tabs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

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
import { ReportsComponent } from './layouts/site-layout/reports/reports.component';
import {ErrorInterseptor} from '../app/layouts/classes/error.interseptor';
import { PersonalComponent } from './layouts/site-layout/personal/personal.component';
import { EquipmentComponent } from './layouts/site-layout/equipment/equipment.component';
import { ReportsAddComponent } from './layouts/site-layout/reports/reportsAdd/reports-add/reports-add.component';
import { ReportsListComponent } from './layouts/site-layout/reports/reports-list/reports-list/reports-list.component';
import { DropdownMultiComponent } from './layouts/classes/dropdown-classes/dropdown-multi/dropdown-multi.component';
import { DateInputComponent } from './layouts/classes/date-input/date-input.component';
import { DropdownSelectComponent } from './layouts/classes/dropdown-select/dropdown-select.component';
import { DropdownMultiCloneComponent } from './layouts/classes/dropdown-classes/dropdown-multi-clone/dropdown-multi-clone.component';
import { ReportsRedComponent } from './layouts/site-layout/reports/reports-red/reports-red.component';
import { ReportViewComponent } from './layouts/site-layout/reports/report-view/report-view.component';


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
    EquipmentComponent,
    ReportsAddComponent,
    ReportsListComponent,
    DropdownMultiComponent,
    DateInputComponent,
    DropdownSelectComponent,
    DropdownMultiCloneComponent,
    ReportsRedComponent,
    ReportViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectInfiniteScrollModule,
    NgxMatSelectSearchModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatCardModule,
    MatDividerModule,
    MatTabsModule,
    InfiniteScrollModule
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
