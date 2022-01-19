import { LiveAnnouncer } from '@angular/cdk/a11y';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NearbyReport } from 'src/app/layouts/services/interfaces';
import { ReportGet } from 'src/app/layouts/services/report-get.service';
import { SaveFile } from 'src/app/layouts/services/save-file.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css', 'report-view-media.component.css']
})
export class ReportViewComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private saveFile: SaveFile, private router: Router, private http: HttpClient, private repGet: ReportGet, private _liveAnnouncer: LiveAnnouncer) {

   }

  reportViewFull = JSON.parse(localStorage.getItem('ReportViewData'))
  reportView = JSON.parse(localStorage.getItem('ReportViewData')).ChiefWorkReport
  locations = JSON.parse(localStorage.getItem('Locations'))
  genLocations = JSON.parse(localStorage.getItem('GeneralLocations'))
  pers = JSON.parse(localStorage.getItem('Personal'))
  persStatusWork = JSON.parse(localStorage.getItem('PesonalStatusesWork'))
  nearbyReport: any = {
    Next: {
      Id: 0,
      СhiefUserId: 0,
      GeneralLocationId: 0,
      DataReport: ""
    },
    Prev: {
      Id: 0,
      СhiefUserId: 0,
      GeneralLocationId: 0,
      DataReport: ""
    },
    IsNext: true,
    IsPrev: true
  };

  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource(this.reportView.CwrWorks);

  displayedColumns = ['№', 'MethodControl', 'Customer.NameRu', 'reportView.CwrWorks.CwrWorkPersonals', 'reportView.CwrWorks.CwrWorkEquipments', 'Shown', 'Made', 'Comment'];
  displayedColumns2 = ['№', 'Personal.Fio','CwrStatusFromPersonalsWork' , 'CwrStatusFromPersonals', 'Comment'];
  displayedColumns3 = ['№', 'Equipment', 'Status', 'Comment'];
  displayedColumns4 = ['№', 'DisplayName',  'Save'];

  panelOpenState = false;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // announceSortChange(sortState: Sort) {
  //   // This example uses English messages. If your application supports
  //   // multiple language, you would internationalize these strings.
  //   // Furthermore, you can customize the message to add additional
  //   // details about the values being sorted.
  //   if (sortState.direction) {
  //     this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  //   } else {
  //     this._liveAnnouncer.announce('Sorting cleared');
  //   }
  // }

  getStatusWork(statusId){
    if (statusId != null) {
      const statusWorkData = JSON.parse(localStorage.getItem('PesonalStatusesWork'))
      let statusObj = statusWorkData.find(x => x.Id == statusId)
      return statusObj.DisplayName
    } else return "-"

  }

  saveFileSub: Subscription
  SaveFile(i){
    console.log("this.reportView[i].FullPath: ", this.reportView.CwrFiles[i].FullPath)
    const linkSource = `${environment.apiUrl}/api/cwr/getfile?id=${this.reportView.CwrFiles[i].Id}`
    const downloadLink = document.createElement("a");
    const fileName = this.reportView.CwrFiles[i].DisplayName

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
  getSubLockName(report){ // Получаем локацию
    // console.log("report.SubLocationId", report.SubLocationId)
    let LockfObj
    let LockfName
    if (report.SubLocationId !== 0){
      LockfObj = this.locations.find(x => x.Id == report.SubLocationId)
      // console.log("LockfObj", LockfObj)
      LockfName = LockfObj.SmallName
    } else LockfName = "Ошибка чтения: локация не существует"

    return LockfName
  }
  getChiedName(report){ //Получаем данные ответственного
    let chiefObj
    let chiefName
      if ((report.СhiefUserId !== 3) && (report.СhiefUserId !== 0) ){
      // console.log("chiefId.СhiefUserId", report.СhiefUserId)
      chiefObj = this.pers.find(x => x.Id == report.СhiefUserId)
      chiefName = chiefObj.SmalFio
    } else chiefName = "Ошибка чтения: сотрудник не существует"
      return chiefName
  }
  actualStatusWork: any [] = [{Name: "", counter: 0}]
  getPersStatus(){
    for (let i = 0; i < this.persStatusWork.length; i++) {
      let count = this.reportView.CwrPersonals.filter(item => item.ForTabPerStatusId === this.persStatusWork[i].Id).length
      this.actualStatusWork[i] = {Name: this.persStatusWork[i].DisplayName, counter: count}
    }
  }

  Method = JSON.parse(localStorage.getItem('MethodControl'))
  actualMethodNk: any [] = [{Name: "", counter: 0, counterShown: 0, counterMade: 0}]
  getMethodNk(){
    for (let i = 0; i < this.Method.length; i++) {
      let countName = this.reportView.CwrWorks.filter(item => {
        return item.MethodControl === this.Method[i].Name
      })
      let countShown = countName.reduce((sum , current) =>   sum + parseInt(current.Shown) , 0)
      let countMade = countName.reduce((sum , current) =>   sum + parseInt(current.Made) , 0)
      this.actualMethodNk[i] = {Name: this.Method[i].Name, counter: countName, counterShown: countShown, counterMade: countMade}
    }
    console.log("this.actualMethodNk: ", this.actualMethodNk)
  }

  FormatDate(date){ //Получаем дату
    date = formatDate(date, 'dd.MM.yyyy', 'en-US', '+0530');
    return date
  }
  getShown(){
    let count = this.reportView.CwrWorks.reduce((sum , current) => {return  sum + parseInt(current.Shown)} , 0)
    return count;
  }
  getMade(){
    let count = this.reportView.CwrWorks.reduce((sum , current) => {return  sum + parseInt(current.Made)} , 0)
    return count;
  }

  eqWorkCount = 0
  eqDontWorkCount = 0
  eqEmptyWorkCount = 0
  getEqStatus(){
    for (let i = 0; i < this.reportView.CwrEquipments.length; i++) {
      if (this.reportView.CwrEquipments[i].Status == "Исправен"){
        this.eqWorkCount++
      }
      if (this.reportView.CwrEquipments[i].Status == "Не исправен"){
        this.eqWorkCount++
      }
      if (this.reportView.CwrEquipments[i].Status == "Отсутствует"){
        this.eqWorkCount++
      }
    }
  }

  arrowBack(){
    this.router.navigate(['/reports/list'])
  }
  loader = false
  getRepSub: Subscription;
  prevReport(){
    this.loader = true
    this.getRepSub = this.repGet.repGetNearby(this.reportViewFull.Prev.Id).subscribe(
      (reportIdData)=>{
        let newReportIdData = JSON.stringify(reportIdData)
        localStorage.setItem('ReportViewData', newReportIdData)
        console.log("reportViewData: ", reportIdData)
        this.ngOnInit()
        this.loader = false
      },
      () => {
        this.loader = false
      }
    )
  }
  nextReport(){
    this.loader = true
    this.getRepSub = this.repGet.repGetNearby(this.reportViewFull.Next.Id).subscribe(
      (reportIdData)=>{
        let newReportIdData = JSON.stringify(reportIdData)
        localStorage.setItem('ReportViewData', newReportIdData)
        console.log("reportViewData: ", reportIdData)
        this.ngOnInit()
        this.loader = false
      },
      () => {
        this.loader = false
      }
    )
  }
  nearbyPrevTooltip(){
    if (this.nearbyReport.IsPrev){
      let nearbyReportData = formatDate(this.nearbyReport.Prev.DataReport, 'dd.MM.yyyy', 'en-US', '+0530')
      let chiefUser = this.pers.find(x => x.Id == this.nearbyReport.Prev.СhiefUserId).SmalFio
      let SubLock = this.locations.find(x => x.Id == this.nearbyReport.Prev.SubLocationId).Name
      let GenLock = this.genLocations.find(x => x.Id == this.nearbyReport.Prev.GeneralLocationId).DisplayName
      let action = "Отчёт № " + this.nearbyReport.Prev.Id + ", " + SubLock + "; " + chiefUser + " от " + nearbyReportData
      return action
    } else return "Отчета не существует"
  }
  nearbyNextTooltip(){
    if (this.nearbyReport.IsNext){
      let nearbyReportData = formatDate(this.nearbyReport.Next.DataReport, 'dd.MM.yyyy', 'en-US', '+0530')
      let chiefUser = this.pers.find(x => x.Id == this.nearbyReport.Next.СhiefUserId).SmalFio
      let SubLock = this.locations.find(x => x.Id == this.nearbyReport.Next.SubLocationId).Name
      let GenLock = this.genLocations.find(x => x.Id == this.nearbyReport.Next.GeneralLocationId).DisplayName
      let action = "Отчёт № " + this.nearbyReport.Next.Id + ", " + SubLock + "; " + chiefUser + " от " + nearbyReportData
      return action
    }else {
      return "Отчета не существует"
    }

  }
  getNearbyReportSub: Subscription;
  ngOnInit() {
    console.log("reportView: ", this.reportView)
    this.reportViewFull = JSON.parse(localStorage.getItem('ReportViewData'))
    this.reportView = JSON.parse(localStorage.getItem('ReportViewData')).ChiefWorkReport
    this.locations = JSON.parse(localStorage.getItem('Locations'))
    this.pers = JSON.parse(localStorage.getItem('Personal'))
    this.persStatusWork = JSON.parse(localStorage.getItem('PesonalStatusesWork'))
    this.getMethodNk()
    this.getEqStatus()
    this.getPersStatus()
    this.nearbyReport = this.reportViewFull
    console.log("nearbyReport: ", this.nearbyReport)
  }
  ngOnDestroy(){
    if (this.getRepSub){
      this.getRepSub.unsubscribe()
    }
    if (this.getNearbyReportSub){
      this.getNearbyReportSub.unsubscribe()
    }
    localStorage.removeItem('nearbyReport')
  }

}
