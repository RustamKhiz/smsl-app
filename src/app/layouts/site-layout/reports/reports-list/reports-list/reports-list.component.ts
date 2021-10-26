import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportAll } from 'src/app/layouts/services/reports-all.service';
import {ReportsAll} from 'src/app/layouts/services/interfaces'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownMultiComponent } from 'src/app/layouts/classes/dropdown-classes/dropdown-multi/dropdown-multi.component';
import { Router } from '@angular/router';
import { ReportGet } from 'src/app/layouts/services/report-get.service';
@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css']
})
export class ReportsListComponent implements OnInit, OnDestroy {
  reportsAll: ReportsAll[]
  today= new Date();
  aSub: Subscription;
  filterSub: Subscription;
  Filter = {
    ReportId: 0,
    FromDate: null,
    ToDate: null,
    ChiefIds: null,
    GeneralLocIds: null,
    SubLocIds: null
  }
  ReportId = 0;
  FromDate: null;
  constructor(private repAll: ReportAll, private dropDown: DropdownMultiComponent, private router: Router, private repGet: ReportGet) {
    // this.Filter.FromDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530');
  }
  UserName: string []=[]
  pers = JSON.parse(localStorage.getItem('Personal'))
  location = JSON.parse(localStorage.getItem('Locations'))
  equipment = JSON.parse(localStorage.getItem('Mashines'))
  formFilter: FormGroup;
  filterTrueFalse = false;
  loading: boolean = false;

  accessLvl: number = JSON.parse(localStorage.getItem('AccessLevel'))


  ngOnInit(){
    this.loading = true;
    if (this.filterTrueFalse == false){
      this.aSub = this.repAll.reportAll(this.Filter).subscribe(
        (AllData) => {
          console.log("Filter is work!", AllData)
          console.log("AllData.ChiefWorkReports:", AllData.ChiefWorkReports)
          const reportData = JSON.stringify(AllData.ChiefWorkReports)
          localStorage.setItem('ReportAll', reportData)
          this.reportsAll = JSON.parse(localStorage.getItem('ReportAll'))

          const PesonalStatuses = JSON.stringify(AllData.CwrPesonalStatuses)
          localStorage.setItem('PesonalStatuses', PesonalStatuses)
          this.loading = false;

          for (let i = 0; i < this.reportsAll.length; i++) {
            for (let j = 0; j < this.pers.length; j++) {
              if (this.reportsAll[i].UserId == this.pers[j].Id){
                this.UserName = this.pers[j].Fio
              }
              // console.log("this.repview.UserId:", this.repview.Id)
              // console.log("testPersId:", this.pers[i].Id)
              // console.log("testPers:", this.pers[i].Fio)
            }
          console.log("test:", this.UserName)
          }
        },
        (error) => {
          console.log("Filter don`t work!")
        }
      )
    }else console.log('filterTrueFalse is true')

    this.formFilter = new FormGroup({
      FromDate: new FormControl(null, Validators.required),
      ToDate: new FormControl(null, Validators.required),
      ReportId: new FormControl('0', Validators.required),
      ChiefIds: new FormControl(null, Validators.required),
      SubLocIds: new FormControl(null, Validators.required)
    })
  }

  persFilterId: number[] = []
  PersFilterIdAdd($event){
    console.log("$event PersFilter: ", $event)
    this.persFilterId = []
    this.persFilterId = this.persFilterId.concat($event.valueId)
    console.log("PersFilter: ", this.persFilterId)
  }
  locationFilterId: number[] = []
  LocationFilterIdAdd($event){
    console.log("$event locationFilter: ", $event)
    this.locationFilterId = []
    this.locationFilterId = this.locationFilterId.concat($event.valueId)
    console.log("locationFilter: ", this.locationFilterId)
  }
  FromDateVal = ""
  FromDateItem($event){
    console.log("$event FromDateItem: ", $event.value)
    this.FromDateVal = $event.value
    console.log("FromDateVal: ", this.FromDateVal)
  }
  ToDateVal = ""
  ToDateItem($event){
    console.log("$event ToDateItem: ", $event.value)
    this.ToDateVal = $event.value
    console.log("ToDateVal: ", this.ToDateVal)
  }
  FilterSubmit(){
    this.loading = true;
    this.dropDown.Submit()

    this.formFilter.get("ChiefIds").setValue(this.persFilterId)
    this.formFilter.get("SubLocIds").setValue(this.locationFilterId)
    this.formFilter.get("FromDate").setValue(this.FromDateVal)
    this.formFilter.get("ToDate").setValue(this.ToDateVal)
    console.log(this.formFilter.get("ChiefIds").value)

    this.filterSub = this.repAll.reportAll(this.formFilter.value).subscribe(
      (FilterData)=>{
        console.log("FilterSubmit is Submit! Data:", FilterData);
        const filterData = JSON.stringify(FilterData.ChiefWorkReports)
        localStorage.setItem('ReportAll', filterData)
        // console.log(localStorage.getItem('ReportAll'))
        this.reportsAll = JSON.parse(localStorage.getItem('ReportAll'))
        for (let i = 0; i < this.reportsAll.length; i++) {
          for (let j = 0; j < this.pers.length; j++) {
            if (this.reportsAll[i].UserId == this.pers[j].Id){
              this.UserName = this.pers[j].Fio
            }
            // console.log("this.repview.UserId:", this.repview.Id)
            // console.log("testPersId:", this.pers[i].Id)
            // console.log("testPers:", this.pers[i].Fio)
          }
        console.log("test:", this.UserName)
        }
        this.filterTrueFalse = true;
        this.loading = false;
        this.persFilterId = []
        this.locationFilterId = []
        // console.log("void numberId", this.numberId)
      },
      (error) => {
        this.loading = false;
        console.log("FilterSubmit is not a Submit!")
      }
    )
  }
  reportRedSub: Subscription
  NavigateToRepRed(i){
    // let Id = JSON.stringify(this.reportsAll[i].Id)
    // localStorage.setItem('ReportRedId', Id)
    // console.log("reportsAll[i].Id: ", this.reportsAll[i].Id)
    // console.log("LCID: ", JSON.parse(localStorage.getItem('ReportRedId')))
    this.reportRedSub = this.repGet.repGet(this.reportsAll[i].Id).subscribe(
      (reportIdData)=>{
      console.log("reportIdData: ", reportIdData)
      let newReportIdData = JSON.stringify(reportIdData)
      localStorage.setItem('ReportIdData', newReportIdData)

      this.router.navigate(['/reports/add-report'])
    }
    )

  }
  ReportView(i){
    this.reportRedSub = this.repGet.repGet(this.reportsAll[i].Id).subscribe(
      (reportIdData)=>{
      console.log("reportViewData: ", reportIdData)
      let newReportIdData = JSON.stringify(reportIdData)
      localStorage.setItem('ReportViewData', newReportIdData)
      this.router.navigate(['/reports/view-report'])
    }
    )
  }
  ngOnDestroy(){
    if(this.aSub){
      this.aSub.unsubscribe()
    }
    if (this.filterSub){
      this.filterSub.unsubscribe()
    }
    if (this.reportRedSub){
      this.reportRedSub.unsubscribe()
    }
  }
}
