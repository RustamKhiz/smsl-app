import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ReportAll } from 'src/app/layouts/services/reports-all.service';
import { ReportsAll} from 'src/app/layouts/services/interfaces'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownMultiComponent } from 'src/app/layouts/classes/dropdown-classes/dropdown-multi/dropdown-multi.component';
import { Router } from '@angular/router';
import { ReportGet } from 'src/app/layouts/services/report-get.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportDel } from 'src/app/layouts/services/report-delete.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ReportFilter } from 'src/app/layouts/services/reports-filter.service';

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
  styleUrls: ['./reports-list.component.css', './report-list-media.component.css']
})

export class ReportsListComponent implements OnInit, OnDestroy {
  reportsAll: ReportsAll[] = []
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
  TwoDayBeforeYesterday = new Date(this.now.getTime() - (1000 * 60 * 60 * 24) - (1000 * 60 * 60 * 24) - (1000 * 60 * 60 * 24) - (this.AllMilSec))
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
  constructor(private repFilter: ReportFilter ,private repAll: ReportAll, private dropDown: DropdownMultiComponent, private router: Router, private repGet: ReportGet, private snackBar: MatSnackBar, private repDel: ReportDel, private changeDetectorRef: ChangeDetectorRef) {
    this.Filter.FromDate = this.TwoDayBeforeYesterday
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

  //paginator__________start
  @ViewChild(MatPaginator) paginator: MatPaginator;

  obs: Observable<any>;
  dataSource: MatTableDataSource<ReportsAll>

  ConnectToPagginList(){

    this.reportsAll.reverse()
    this.dataSource = new MatTableDataSource<ReportsAll>(this.reportsAll);
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;

    this.obs = this.dataSource.connect();
  }
  //paginator__________end

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
            console.log("Filter is work! AllData", AllData)
            console.log("AllData.ChiefWorkReports:", AllData.ChiefWorkReports)
            const reportData = JSON.stringify(AllData.ChiefWorkReports)
            localStorage.setItem('ReportAll', reportData)
            this.reportsAll = JSON.parse(localStorage.getItem('ReportAll'))

            let PesonalStatusesWork: any [] = [];
            let PesonalStatuses: any [] = [];
            for (let i = 0; i < AllData.CwrPesonalStatuses.length; i++) {
              if (AllData.CwrPesonalStatuses[i].IsWork == true){
                PesonalStatusesWork.push(AllData.CwrPesonalStatuses[i])
              } else {
                PesonalStatuses.push(AllData.CwrPesonalStatuses[i])
              }
            }
            console.log("PesonalStatusesWork: ", PesonalStatusesWork)
            console.log("PesonalStatuses: ", PesonalStatuses)

            const PesonalStatusesWorkC = JSON.stringify(PesonalStatusesWork)
            localStorage.setItem('PesonalStatusesWork', PesonalStatusesWorkC)

            const PesonalStatusesC = JSON.stringify(PesonalStatuses)
            localStorage.setItem('PesonalStatuses', PesonalStatusesC)

            this.loading = false;

            if (this.reportsAll.length == 0){
              console.log("reportsAll == undefined!!!")
              this.openSnackBar("За сегодня ни одного отчета не найдено", "Ok")
            } else {
              this.openSnackBar(`Найдено отчётов: ${this.reportsAll.length}` , "Ok")
            }
            this.reportsAll.sort((a, b) => {
              return moment(a.DataReport).toDate().getTime() > moment(b.DataReport).toDate().getTime() ? 1 : -1;
            })
            this.ConnectToPagginList()


          },
          (error) => {
            console.log("Filter don`t work!")
          }
        )
      }, 3000)

    } else {
      this.reportsAll = JSON.parse(localStorage.getItem('ReportAll'))
      this.ConnectToPagginList()
      this.loading = false;
      this.openSnackBar(`Последний примененный фильтр. Найдено отчётов: ${this.reportsAll.length} ` , "Ok")
    }
    // this.dateReportSort(this.reportsAll)

}
  dateReportSort(report){
    report.sort((a, b) => {
      moment(a.DataReport).toDate().getTime() > moment(b.DataReport).toDate().getTime() ? 1 : -1
    })
    report.reverse()
    console.log("report: ", report)
    return report
  }
  FilterSubmit(){
    localStorage.removeItem('newRepParam')
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
    // } else if ((this.Filter.FromDate == null) && (this.Filter.SubLocIds !== null)) {
    //   this.loading = false;
    //   this.openSnackBar(`Для начала выберите дату` , "Ok")
    } else {
      console.log("!!")
      this.filterSub = this.repFilter.reportFilter(this.Filter).subscribe(
        (FilterData)=>{
            console.log("FilterSubmit is Submit! Data:", FilterData);
            if (FilterData.length > 250){
              this.openSnackBar("Вы загружаете слишком много отчетов, выберите меньший диапазон дат", "Ok")
            } else {
              const filterData = JSON.stringify(FilterData)
              localStorage.setItem('ReportAll', filterData)
              this.reportsAll = JSON.parse(localStorage.getItem('ReportAll'))

              console.log("reportsAll: ", this.reportsAll)
              if (this.reportsAll.length == 0){
                console.log("reportsAll == undefined!!!")
                this.openSnackBar("Ни одного отчета не найдено", "Ok")
              } else {
                this.openSnackBar(`Найдено отчётов: ${this.reportsAll.length}` , "Ok")
              }
              this.ConnectToPagginList()
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
    localStorage.removeItem('newRepParam')
    this.loading = true;
    this.Filter = {
      ReportId: 0,
      FromDate: this.TwoDayBeforeYesterday,
      ToDate: this.today,
      ChiefIds: null,
      GeneralLocIds: null,
      SubLocIds: null
    }

    this.aSub = this.repFilter.reportFilter(this.Filter).subscribe(
      (AllData) => {
        console.log("Filter today is work!", AllData)
        console.log("AllData:", AllData)
        const reportData = JSON.stringify(AllData)
        localStorage.setItem('ReportAll', reportData)
        this.reportsAll = JSON.parse(localStorage.getItem('ReportAll'))

        // const PesonalStatuses = JSON.stringify(AllData.CwrPesonalStatuses)
        // localStorage.setItem('PesonalStatuses', PesonalStatuses)
        if (this.reportsAll.length == 0){
          console.log("reportsAll == undefined!!!")
          this.openSnackBar("За сегодня ни одного отчета не найдено", "Ok")
          localStorage.removeItem('ReportAll')
        } else {
          this.openSnackBar(`Найдено отчётов: ${this.reportsAll.length}` , "Ok")
        }
        // this.dateReportSort(this.reportsAll)
        this.ConnectToPagginList()
        this.loading = false;
      },
      (error) => {
        console.log("Filter don`t work!")
        this.loading = false;
      }
    )
  }

  FilterReset(){
    localStorage.removeItem('newRepParam')
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

  getChiedId(report: ReportsAll){
    let chiefObj
    let chiefId
      if ((report.СhiefUserId !== 3) && (report.СhiefUserId !== 0) ){
      // console.log("chiefId.СhiefUserId", report.СhiefUserId)
      chiefObj = this.pers.find(x => x.Id == report.СhiefUserId)
      chiefId = chiefObj.Id
    } else chiefId = "Ошибка чтения: сотрудник не существует"
      return chiefId
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
  accessLvl: number = JSON.parse(localStorage.getItem('AccessLevel'))
  userId = JSON.parse(localStorage.getItem('Id'))
  userAccessLvl = JSON.parse(localStorage.getItem('UserData')).MyPerson.UsersRolles
  HashRepRed = "77505032-23DD-4115-A7D5-5A39B52D88C9"
  AccessLevelCheck(report){

    let userRepRedLvl = this.userAccessLvl.find(x => x.Id == 38)
    let userRepRedLvlHash = ""

    if (userRepRedLvl !== undefined){
      userRepRedLvlHash = userRepRedLvl.HashId
    }

    let dataCreate = new Date(report.DataCreate)
    let lastDayAccess = this.now.getTime() - dataCreate.getTime()
    let oneDay = 1000 * 60 * 60 * 24
    // console.log("today: ", this.today.getTime())
    // console.log("dataCreate: ", dataCreate.getTime())
    // console.log("lastDayAccess: ", lastDayAccess)
    // console.log("userRepordRedLvl: ", this.userRepordRedLvl)

    if ((this.accessLvl >= 5)){
      return true
    } else if ( (this.HashRepRed == userRepRedLvlHash)){
      return true
    } else if ((this.userId == report.UserId) && (lastDayAccess < oneDay)){
      return true
    }
    else {
      return false
    }
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

  ReportDel(i){
      this.reportDelSub = this.repDel.repDel(this.reportId, this.reportItem).subscribe(
        () => {
          console.log("Удаление прошло успешно!")
          // localStorage.removeItem('newRepParam')
          // console.log("Удаление прошло успешно!", i)
          this.openSnackBar("Удаление прошло успешно", "Ok")
          this.repDeleteWind = false
          this.reportsAll.reverse()
          this.reportsAll.splice(i, 1)
          // let RepAllList: [] = JSON.parse(localStorage.getItem('ReportAll'))
          // RepAllList.reverse()
          // RepAllList.splice(i, 1)
          // console.log("RepAllList", RepAllList)
          localStorage.setItem('ReportAll', JSON.stringify(this.reportsAll))
          this.dataSource = new MatTableDataSource<ReportsAll>(this.reportsAll);
          this.changeDetectorRef.detectChanges();
          this.dataSource.paginator = this.paginator;

          this.obs = this.dataSource.connect();
        },
        () => {
          console.log("Ошибка удаления отчёта!")
        }
      )

  }

  viewList = true
  viewGrid = false
  reportViewList(){
    this.viewList = true
    this.viewGrid = false
  }
  reportViewGrid(){
    this.viewList = false
    this.viewGrid = true
  }
  // viewList = false
  // reportViewList(){
  //   this.viewList = !this.viewList
  // }
  newReportView(i){
    let newRepParam = JSON.parse(localStorage.getItem('newRepParam'))
    if ((i == 0) && (newRepParam == 1) ){
      return true
    } else {
      return false
    }
  }
  filterMobileCheck: boolean = false;
  filterMobileOpen(){
    this.filterMobileCheck = true
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
    localStorage.removeItem('newRepParam')

  }
}
