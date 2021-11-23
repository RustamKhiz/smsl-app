import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportAll } from 'src/app/layouts/services/reports-all.service';
import { ReportsAll} from 'src/app/layouts/services/interfaces'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownMultiComponent } from 'src/app/layouts/classes/dropdown-classes/dropdown-multi/dropdown-multi.component';
import { Router } from '@angular/router';
import { ReportGet } from 'src/app/layouts/services/report-get.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportDel } from 'src/app/layouts/services/report-delete.service';

export class NewDropdown {
  constructor(
              public Id: number,
              public Name: string,
              public Display: boolean,
              public IsSelect: boolean
  ) {}
}

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css']
})

export class ReportsListComponent implements OnInit, OnDestroy {
  reportsAll: ReportsAll[]
  now = new Date();

  hours = this.now.getHours() * 60 * 60 * 1000
  minutes = this.now.getMinutes() * 60 * 1000
  seconds = this.now.getSeconds() * 1000
  milsec = this.now.getMilliseconds()
  AllMilSec = this.hours + this.minutes + this.seconds + this.milsec
  today = new Date (this.now.getTime() - (this.AllMilSec))
  tomorrow = new Date(this.now.getTime() + (1000 * 60 * 60 * 24) - (this.AllMilSec))
  yesterday = new Date(this.now.getTime() - (1000 * 60 * 60 * 24) - (this.AllMilSec))
  beforeYesterday = new Date(this.now.getTime() - (1000 * 60 * 60 * 24) - (1000 * 60 * 60 * 24) - (this.AllMilSec))
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
  constructor(private repAll: ReportAll, private dropDown: DropdownMultiComponent, private router: Router, private repGet: ReportGet, private snackBar: MatSnackBar, private repDel: ReportDel) {
    this.Filter.FromDate = this.beforeYesterday
    this.Filter.ToDate = this.today
  }
  UserName: string []=[]
  pers = JSON.parse(localStorage.getItem('Personal'))
  PersData: NewDropdown [] = [];
  location = JSON.parse(localStorage.getItem('Locations'))
  LocationData: NewDropdown [] = [];
  equipment = JSON.parse(localStorage.getItem('Mashines'))
  GeneralLocations = JSON.parse(localStorage.getItem('GeneralLocations'))

  filterTrueFalse = false;
  loading: boolean = false;

  accessLvl: number = JSON.parse(localStorage.getItem('AccessLevel'))

  FromDateCtrl: FormControl = new FormControl(null)
  ToDateCtrl: FormControl = new FormControl(null)
  ReportIdCtrl: FormControl = new FormControl('0')
  ChiefIdsCtrl: FormControl = new FormControl(null)
  SubLocIdsCtrl: FormControl = new FormControl(null)

  ngOnInit(){
    let Id
    let Name
    let Display
    let IsSelect
    for (let i = 0; i < this.pers.length; i++) {
      if (this.pers[i].StatusWork !== "Уволен"){
        Id = this.pers[i].Id
        Name = this.pers[i].Name + " " + this.pers[i].LastName
        Display = true
        IsSelect = false
        this.PersData.push(new NewDropdown(Id, Name, Display, IsSelect))
      }
    }
    for (let i = 0; i < this.location.length; i++) {
      if (this.location[i].Actual == 1){
        Id = this.location[i].Id
        Name = this.location[i].SmallName
        Display = true
        IsSelect = true
        this.LocationData.push(new NewDropdown(Id, Name, Display, IsSelect))
      }
    }


    this.loading = true;
    if (localStorage.getItem('ReportAll') !== null) {
      if (JSON.parse(localStorage.getItem('ReportAll')).length == 0){
        localStorage.removeItem('ReportAll')
      }
    }

    if (localStorage.getItem('ReportAll') == null){
      setTimeout(() => {
        console.log("this.Filter: ", this.Filter)
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

            if (this.reportsAll.length == 0){
              console.log("reportsAll == undefined!!!")
              this.openSnackBar("За сегодня ни одного отчета не найдено", "Ok")
            } else {
              this.openSnackBar(`Найдено отчётов: ${this.reportsAll.length}` , "Ok")
            }
            // for (let i = 0; i < this.reportsAll.length; i++) {
            //   for (let j = 0; j < this.pers.length; j++) {
            //     if (this.reportsAll[i].UserId == this.pers[j].Id){
            //       this.UserName = this.pers[j].Fio
            //     }
            //   }
            // console.log("test:", this.UserName)
            // }
          },
          (error) => {
            console.log("Filter don`t work!")
          }
        )
      }, 3000)

    } else {
      this.reportsAll = JSON.parse(localStorage.getItem('ReportAll'))
      this.loading = false;
      this.openSnackBar(`Последний примененный фильтр. Найдено отчётов: ${this.reportsAll.length} ` , "Ok")
    }

}
  FilterSubmit(){
    this.loading = true;

    let ChiefIdsList: any [] = []
    let SubLocIdsList: any [] = []
    if (this.ChiefIdsCtrl.value !== null){
      for (let i = 0; i < this.ChiefIdsCtrl.value.length; i++) {
        ChiefIdsList.push(this.ChiefIdsCtrl.value[i].Id)
      }
    } else {
      ChiefIdsList = null
    }

    if (this.SubLocIdsCtrl.value !== null)
    for (let i = 0; i < this.SubLocIdsCtrl.value.length; i++) {
      SubLocIdsList.push(this.SubLocIdsCtrl.value[i].Id)
    } else {
      SubLocIdsList = null
    }

    this.Filter = {
      ReportId: this.ReportIdCtrl.value,
      FromDate: this.FromDateCtrl.value,
      ToDate: this.ToDateCtrl.value,
      ChiefIds: ChiefIdsList,
      GeneralLocIds: null,
      SubLocIds: SubLocIdsList
    }
    if (this.ReportIdCtrl.value == null) {
      this.Filter.ReportId = 0
    }

    if ((this.Filter.ReportId == 0) && (this.Filter.FromDate == null) && (this.Filter.ChiefIds == null) && (this.Filter.SubLocIds == null)){
      console.log("!")
      this.loading = false;
      this.openSnackBar("Фильтр не может быть пустым!", "Ok")
    } else {
      console.log("!!")
      this.filterSub = this.repAll.reportAll(this.Filter).subscribe(
        (FilterData)=>{
            console.log("FilterSubmit is Submit! Data:", FilterData);
            const filterData = JSON.stringify(FilterData.ChiefWorkReports)
            localStorage.setItem('ReportAll', filterData)
            this.reportsAll = JSON.parse(localStorage.getItem('ReportAll'))

            console.log("reportsAll: ", this.reportsAll)
            if (this.reportsAll.length == 0){
              console.log("reportsAll == undefined!!!")
              this.openSnackBar("Ни одного отчета не найдено", "Ok")
            } else {
              this.openSnackBar(`Найдено отчётов: ${this.reportsAll.length}` , "Ok")
            }
            this.filterTrueFalse = true;
            this.loading = false;

            this.FromDateCtrl.reset()
            this.ToDateCtrl.reset()
            this.ReportIdCtrl.reset()
            this.ChiefIdsCtrl.reset()
            this.SubLocIdsCtrl.reset()
          },
            () => {
              this.loading = false;
              console.log("FilterSubmit is not a Submit!");

              this.openSnackBar("Возникла непредвиденная ошибка, перезагрузите страницу", "Ok")
            }
      )
    }
  }

FilterToday(){
  this.loading = true;
  this.Filter = {
    ReportId: 0,
    FromDate: this.yesterday,
    ToDate: this.today,
    ChiefIds: null,
    GeneralLocIds: null,
    SubLocIds: null
  }

  this.aSub = this.repAll.reportAll(this.Filter).subscribe(
    (AllData) => {
      console.log("Filter is work!", AllData)
      console.log("AllData.ChiefWorkReports:", AllData.ChiefWorkReports)
      const reportData = JSON.stringify(AllData.ChiefWorkReports)
      localStorage.setItem('ReportAll', reportData)
      this.reportsAll = JSON.parse(localStorage.getItem('ReportAll'))

      const PesonalStatuses = JSON.stringify(AllData.CwrPesonalStatuses)
      localStorage.setItem('PesonalStatuses', PesonalStatuses)
      if (this.reportsAll.length == 0){
        console.log("reportsAll == undefined!!!")
        this.openSnackBar("За сегодня ни одного отчета не найдено", "Ok")
        localStorage.removeItem('ReportAll')
      } else {
        this.openSnackBar(`Найдено отчётов: ${this.reportsAll.length}` , "Ok")
      }
      this.loading = false;
    },
    (error) => {
      console.log("Filter don`t work!")
      this.loading = false;
    }
  )
}

  FilterReset(){
    localStorage.removeItem('ReportAll')
    this.FromDateCtrl.reset()
    this.ToDateCtrl.reset()
    this.ReportIdCtrl.reset()
    this.ChiefIdsCtrl.reset()
    this.SubLocIdsCtrl.reset()
    this.openSnackBar("Фильры успешно очищены", "Ок")
  }

  FilterTest(){
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
  openSnackBar(message: string, action: string) {
    // let message = "Ошибка отправки отчета"
    // let action = "Ok"
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }

  getChiedName(report: ReportsAll){
    let chiefObj
    let chiefName
      if ((report.СhiefUserId !== 3) && (report.СhiefUserId !== 0) ){
      // console.log("chiefId.СhiefUserId", report.СhiefUserId)
      chiefObj = this.pers.find(x => x.Id == report.СhiefUserId)
      chiefName = chiefObj.SmalFio
    } else chiefName = "Ошибка чтения: сотрудник не существует"
      return chiefName
  }

  getSubLockName(report){
    // console.log("report.SubLocationId", report.SubLocationId)
    let LockfObj
    let LockfName
    if (report.SubLocationId !== 0){
      LockfObj = this.location.find(x => x.Id == report.SubLocationId)
      // console.log("LockfObj", LockfObj)
      LockfName = LockfObj.SmallName
    } else LockfName = "Ошибка чтения: локация не существует"

    return LockfName
  }
  getLength(report){
    return  report.length
  }
  getLogo(generalLoc){
    let GeneralLogoLink
    GeneralLogoLink = this.GeneralLocations.find(x => x.Id == generalLoc)
    return GeneralLogoLink.Logo
  }

  // this.Filter.FromDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530');
  FormatDate(date){
    date = formatDate(date, 'dd.MM.yyyy', 'en-US', '+0530');
    // console.log("date", date)
    return date
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
  repDeleteWind = false
  delYesNo = false
  reportId;
  reportItem;
  i;
  popupDelOpen(reporti, report, i){
    this.repDeleteWind = true

    this.reportId = reporti
    this.reportItem = report
    this.i = i

  }
  reportDelSub: Subscription

  ReportDel(){

      this.reportDelSub = this.repDel.repDel(this.reportId, this.reportItem).subscribe(
        () => {
          console.log("Удаление прошло успешно!")
          this.openSnackBar("Удаление прошло успешно", "Ok")
          this.repDeleteWind = false
        },
        () => {
          console.log("Ошибка удаления отчёта!")
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
