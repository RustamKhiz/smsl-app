import { LiveAnnouncer } from '@angular/cdk/a11y';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { async, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Locations, NearbyReport, Personals, ReportsAll } from 'src/app/layouts/services/interfaces';
import { ReportGet } from 'src/app/layouts/services/report-get.service';
import { SaveFile } from 'src/app/layouts/services/save-file.service';
import { environment } from 'src/environments/environment';

export class Reports{
  constructor(
    public Id: number,
    public DataCreate: string,
       public UserId: number,
       public СhiefUserId: number,
       public GeneralLocationId: number,
       public SubLocationId: number,
       public DataReport: string,
       public Comment: string,
       public GeneralLocation: {
        Id: number,
        DisplayName: string,
        Logo: string
      },
       public CwrWorks: [{
        Id: number,
        MethodControl: string,
        CustomerId: number,
        Customer: {
          id: number,
          NameRu: string,
          NameEn: string,
          Inn: number,
          MapOffice: string
        },
        Shown: string,
        Made: string,
        Comment: string,
        CwrId: number,
        CwrWorkPersonals: [{
          Id: number,
          PersonalId: number,
          CwrWorkId: number,
          Personal: {
            Id: number,
            Fio: string,
            Bithday: string,
            Gender: string,
            Adress: string,
            Telephone: string,
            EMail: string,
            DefId: string,
            Organization: string,
            Position: string,
            Location: string,
            StatusWork: string,
            Name: string,
            LastName: string,
            MidName: string,
            SmalFio: string
          }
        }],
        CwrWorkEquipments:[{
          Id: number,
          EquipmentId: number,
          CwrWorkId: number,
          Equipment:{
            Id: number,
            MetodNk: string,
            Name: string,
            FullName: string,
            Number: number,
            DataCheck: string,
            CertName: string,
            Sezlab: string,
            Status: string,
            Location: string,
            PeronalFio: string,
            DataProduction: string,
            Group: string,
            Comments: string,
            LocationMvz: string,
            LargeName: string,
            ProductionCompany: string,
            LandCreate: string
          }
        }]
      }],
      public CwrPersonals:[{
        Id: number,
        PersonalId: number,
        Comment: string,
        CwrId: number,
        Personal:{
          Id: number,
          Fio: string,
          Bithday: string,
          Gender: string,
          Adress: string,
          Telephone: string,
          EMail: string,
          DefId: string,
          Organization: string,
          Position: string,
          Location: string,
          StatusWork: string,
          Name: string,
          LastName: string,
          MidName: string,
          SmalFio: string
        },
        CwrStatusFromPersonals:[{
          Id: number,
            CwrStatusId: number,
            CwrPesonalStatus: {
              Id: number,
              DisplayName: string,
              Description: string,
              IsWork: boolean
            },
            CwrPersonalId: number
        }],
        ForTabPerStatusId: number
      }],
      public CwrEquipments:[{
        Id: number,
        EquipmentId: number,
        Status: string,
        Equipment: {
          Id: number,
          MetodNk: string,
          Name: string,
          FullName: string,
          Number: number,
          DataCheck: string,
          CertName: string,
          Sezlab: string,
          Status: string,
          Location: string,
          PeronalFio: string,
          DataProduction: string,
          Group: string,
          Comments: string,
          LocationMvz: string,
          LargeName: string,
          ProductionCompany: string,
          LandCreate: string
        },
        CwrId: number
      }],
      public CwrActions: [],
      public CwrFiles: [
        {
          CwrId: string,
          DisplayName: string,
          Ext: string,
          FileType: string,
          FullPath: string,
          Hash: string,
          Id: number,
          IsPreveiw: boolean,
          Length: number,
          OriginalName: string
        }
      ],
      public IsActual?: boolean,


              )
  { }
}

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css', 'report-view-media.component.css']
})
export class ReportViewComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private saveFile: SaveFile, private queryRoute: ActivatedRoute, private router: Router, private http: HttpClient, private repGet: ReportGet, private _liveAnnouncer: LiveAnnouncer) {

   }

  reportViewFull: any = []
  reportView: Reports = {
    Id: 0,
    DataCreate: "2022-01-24T06:42:48",
    UserId: 0,
    СhiefUserId: 0,
    GeneralLocationId: 0,
    SubLocationId: 10,
    DataReport: "2022-01-23T00:00:00",
    Comment: "",
    IsActual: true,
    GeneralLocation: {
      Id: 0,
      DisplayName: "",
      Logo: ""
    },
    CwrWorks: [{
      Id: 0,
      MethodControl: "",
      CustomerId: 0,
      Customer: {
        id: 0,
        NameRu: "",
        NameEn: "",
        Inn: 0,
        MapOffice: ""
      },
      Shown: '',
      Made: '',
      Comment: "",
      CwrId: 0,
      CwrWorkPersonals: [{
        Id: 0,
        PersonalId: 0,
        CwrWorkId: 0,
        Personal: {
          Id: 0,
          Fio: "",
          Bithday: "",
          Gender: "",
          Adress: "",
          Telephone: "",
          EMail: "",
          DefId: "",
          Organization: "",
          Position: "",
          Location: "",
          StatusWork: "",
          Name: "",
          LastName: "",
          MidName: "",
          SmalFio: ""
        }
      }],
      CwrWorkEquipments:[{
        Id: 0,
        EquipmentId: 0,
        CwrWorkId: 0,
        Equipment:{
          Id: 0,
          MetodNk: "",
          Name: "",
          FullName: "",
          Number: 0,
          DataCheck: "",
          CertName: "",
          Sezlab: "",
          Status: "",
          Location: "",
          PeronalFio: "",
          DataProduction: "",
          Group: "",
          Comments: "",
          LocationMvz: "",
          LargeName: "",
          ProductionCompany: "",
          LandCreate: ""
        }
      }]
    }],
    CwrPersonals:[{
      Id: 0,
      PersonalId: 0,
      Comment: "",
      CwrId: 0,
      Personal:{
        Id: 0,
        Fio: "",
        Bithday: "",
        Gender: "",
        Adress: "",
        Telephone: "",
        EMail: "",
        DefId: "",
        Organization: "",
        Position: "",
        Location: "",
        StatusWork: "",
        Name: "",
        LastName: "",
        MidName: "",
        SmalFio: ""
      },
      CwrStatusFromPersonals:[{
          Id: 0,
          CwrStatusId: 0,
          CwrPesonalStatus: {
            Id: 0,
            DisplayName: "",
            Description: "",
            IsWork: true
          },
          CwrPersonalId: 0
      }],
      ForTabPerStatusId: 10
    }],
    CwrEquipments:[{
      Id: 0,
      EquipmentId: 0,
      Status: "",
      Equipment: {
        Id: 0,
        MetodNk: "",
        Name: "",
        FullName: "",
        Number: 0,
        DataCheck: "",
        CertName: "",
        Sezlab: "",
        Status: "",
        Location: "",
        PeronalFio: "",
        DataProduction: "",
        Group: "",
        Comments: "",
        LocationMvz: "",
        LargeName: "",
        ProductionCompany: "",
        LandCreate: ""
      },
      CwrId: 0
    }],
    CwrActions: [],
    CwrFiles: [
      {
        CwrId: "",
        DisplayName: "",
        Ext: "",
        FileType: "",
        FullPath: "",
        Hash: "",
        Id: 0,
        IsPreveiw: false,
        Length: 0,
        OriginalName: ""
      }
    ]

  }
  // reportView: Reports
  locations
  // : Locations = {
  //   Locations: [{
  //     Actual: 0,
  //     DataBaseName: "",
  //     Description: "",
  //     GeneralLocationId: 0,
  //     HashId: null,
  //     Id: 0,
  //     Name: "",
  //     SmallName: "",
  //     WeatherId: "",
  //     WeatherName: ""
  //   }]
  // }
  genLocations: any = []
  pers
  // : Personals = {
  //   Personals:[{
  //     Id: 0,
  //     Fio: "",
  //     SmalFio: "",
  //     Bithday: "",
  //     Gender: "",
  //     Adress: "",
  //     Telephone: "",
  //     EMail: "",
  //     DefId: "",
  //     Organization: "",
  //     Position: "",
  //     Location: "",
  //     StatusWork: "",
  //     Inn: "",
  //     Snils: "",
  //     GenPass: "",
  //     Name: "",
  //     LastName: "",
  //     MidName: "",
  //     IsOnline: false
  //   }]
  // }

  persStatusWork: any = []
  nearbyReport: NearbyReport = {
    Next: {
      Id: 0,
      СhiefUserId: 0,
      GeneralLocationId: 0,
      SubLocationId: 0,
      DataReport: "2022-01-23T00:00:00"
    },
    Prev: {
      Id: 0,
      СhiefUserId: 0,
      GeneralLocationId: 0,
      SubLocationId: 0,
      DataReport: "2022-01-23T00:00:00"
    },
    IsNext: true,
    IsPrev: true
  };

  SubLockName: string = "Загрузка..."
  ChiefName: string = "Загрузка..."
  nearbyPrevAction;
  nearbyNextAction;
  ngOnInit ()  {
    let id: number;
    this.sub = this.queryRoute.queryParams.subscribe((params) => {
      id = params['id']
    })
    console.log('id: ', id)
    this.loader = true
      this.reportRedSub = this.repGet.repGetNearby(id).subscribe(
        (reportIdData)=>{
          let newReportIdData = JSON.stringify(reportIdData)
          console.log('reportIdData: ', reportIdData)
          localStorage.setItem('ReportViewData', newReportIdData)
          this.reportViewFull = JSON.parse(localStorage.getItem('ReportViewData'))
          this.reportView = this.reportViewFull.ChiefWorkReport  // JSON.parse(localStorage.getItem('ReportViewData')).ChiefWorkReport
          console.log("reportView: ", this.reportView)

          this.locations = JSON.parse(localStorage.getItem('Locations'))
          this.pers = JSON.parse(localStorage.getItem('Personal'))
          this.persStatusWork = JSON.parse(localStorage.getItem('PesonalStatusesWork'))
          this.getMethodNk()
          this.getEqStatus()
          this.getPersStatus()
          this.nearbyReport = this.reportViewFull

          this.SubLockName = this.getSubLockName(this.reportView)
          this.ChiefName = this.getChiedName(this.reportView)

          this.nearbyPrevAction = this.nearbyPrevTooltip(this.nearbyReport)
          this.nearbyNextAction = this.nearbyNextTooltip(this.nearbyReport)
          this.loader = false
          this.sortPers()
        }
      ),
      (err) => {
        console.log("repGetNearby dont work! :", err)
        this.loader = false
      }

  }

  sortPers(){
    console.log('this.reportsPers before ', this.reportView.CwrPersonals)

    this.reportView.CwrPersonals.sort((x, y) => {
      // return x.Personal.LastName.localeCompare(y.Personal.LastName, 'ru', { sensitivity: 'base' })

      if (x.Personal.LastName < y.Personal.LastName) {return -1;}
      if (x.Personal.LastName > y.Personal.LastName) {return 1;}
      return 0;
    })
    console.log('this.reportsPers after ', this.reportView.CwrPersonals)

  }

  panelOpenState = false;

  displayedColumns = ['№', 'MethodControl', 'Customer.NameRu', 'reportView.CwrWorks.CwrWorkPersonals', 'reportView.CwrWorks.CwrWorkEquipments', 'Shown', 'Made', 'Comment'];
  displayedColumns2 = ['№', 'Personal.Fio','CwrStatusFromPersonalsWork' , 'CwrStatusFromPersonals', 'Comment'];
  displayedColumns3 = ['№', 'Equipment', 'Status', 'Comment'];
  displayedColumns4 = ['№', 'DisplayName',  'Save'];

  ngAfterViewInit() {
    // this.dataSourcePers.sort = this.sort;
  }

  getStatusWork(statusId){
    if (statusId != null) {
      const statusWorkData = JSON.parse(localStorage.getItem('PesonalStatusesWork'))
      let statusObj = statusWorkData.find(x => x.Id == statusId)
      return statusObj.DisplayName
    } else return "-"
  }

  saveFileSub: Subscription
  SaveFile(i){
    console.log("this.reportView[i].FullPath: ", this.reportView[0].Report.CwrFiles[i].FullPath)
    const linkSource = `${environment.apiUrl}/api/cwr/getfile?id=${this.reportView[0].Report.CwrFiles[i].Id}`
    const downloadLink = document.createElement("a");
    const fileName = this.reportView[0].Report.CwrFiles[i].DisplayName

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  getSubLockName(report){ // Получаем локацию
    // console.log("report.SubLocationId", report.SubLocationId)
    let LockfObj
    let LockfName
    if (report.SubLocationId !== 0){
      // console.log('report', report)
      // console.log('this.locations: ', this.locations)
      LockfObj = this.locations.find(x => x.Id == report.SubLocationId)
      // console.log("LockfObj", LockfObj.SmallName)
      LockfName = LockfObj.SmallName
    } else LockfName = "Ошибка чтения: локация не существует"

    return LockfName
  }
  getChiedName(report){ //Получаем данные ответственного
    let chiefObj
    let chiefName
      if ((report.СhiefUserId !== 3) && (report.СhiefUserId !== 0) ){
      // console.log('report', report)
      // console.log("chiefId.СhiefUserId", report.СhiefUserId)
      chiefObj = this.pers.find(x => x.Id == report.СhiefUserId)
      // console.log("chiefObj", chiefObj)
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
    // console.log("this.actualMethodNk: ", this.actualMethodNk)
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
        this.eqDontWorkCount++
      }
      if (this.reportView.CwrEquipments[i].Status == "Отсутствует"){
        this.eqEmptyWorkCount++
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
    console.log('this.reportViewFull.Prev.Id', this.reportViewFull.Prev.Id)

    this.router.navigate(['/view-report'], {
            queryParams:{
              id: this.reportViewFull.Prev.Id
            }
          })
    // this.reportRedSub.unsubscribe()
    // this.sub.unsubscribe()
    setTimeout(()=>{
      this.ngOnInit()
    },0)

  }
  nextReport(){
    this.loader = true
    this.getRepSub = this.repGet.repGetNearby(this.reportViewFull.Next.Id).subscribe(
      (reportIdData)=>{
        let newReportIdData = JSON.stringify(reportIdData)
        localStorage.setItem('ReportViewData', newReportIdData)
        // console.log("reportViewData: ", reportIdData)
        this.router.navigate(['/view-report'], {
          queryParams:{
            id: this.reportViewFull.Next.Id
          }
        })
        setTimeout(()=>{
          this.ngOnInit()
        },0)
      },
      () => {
      }
    )
  }
  nearbyPrevTooltip(nearby){
    if (nearby.IsPrev){
      let nearbyReportData = formatDate(nearby.Prev.DataReport, 'dd.MM.yyyy', 'en-US', '+0530')

      let chiefUser = this.pers.find(x => x.Id == nearby.Prev.СhiefUserId).SmalFio
      // console.log('chiefUser: ', chiefUser)
      let SubLock = this.locations.find(x => x.Id == nearby.Prev.SubLocationId).Name
      // let GenLock = this.genLocations.find(x => x.Id == this.nearbyReport.Prev.GeneralLocationId).DisplayName
      let action = "Отчёт № " + nearby.Prev.Id + ", " + SubLock + "; " + chiefUser + " от " + nearbyReportData
      return action
    } else return "Отчета не существует"
  }

  nearbyNextTooltip(nearby){
    if (nearby.IsNext){
      let nearbyReportData = formatDate(nearby.Next.DataReport, 'dd.MM.yyyy', 'en-US', '+0530')
      let chiefUser = this.pers.find(x => x.Id == nearby.Next.СhiefUserId).SmalFio
      let SubLock = this.locations.find(x => x.Id == nearby.Next.SubLocationId).Name
      // let GenLock = this.genLocations.find(x => x.Id == this.nearbyReport.Next.GeneralLocationId).DisplayName
      let action = "Отчёт № " + nearby.Next.Id + ", " + SubLock + "; " + chiefUser + " от " + nearbyReportData
      return action
    }else {
      return "Отчета не существует"
    }

  }
  getNearbyReportSub: Subscription;
  reportRedSub: Subscription;
  sub: Subscription


  getRedRepSub: Subscription;

  ReportRed(){
    this.getRedRepSub = this.repGet.repGet(this.reportView.Id).subscribe((reportIdData) => {
      const newReportIdData = JSON.stringify(reportIdData)
      localStorage.setItem('ReportIdData', newReportIdData)
      this.router.navigate(['/reports/add-report'])
    }, (err) => {

    })
  }

  userAccessLvl = JSON.parse(localStorage.getItem('UserData')).MyPerson.UsersRolles
  accessLvl: number = JSON.parse(localStorage.getItem('AccessLevel'))
  HashRepRed = "77505032-23DD-4115-A7D5-5A39B52D88C9"
  userId = JSON.parse(localStorage.getItem('Id'))
  now = new Date();

  AccessLevelCheck(report){
    let userRepRedLvl = this.userAccessLvl.find(x => x.Id == 38)
    let userRepRedLvlHash = ""

    if (userRepRedLvl !== undefined){
      userRepRedLvlHash = userRepRedLvl.HashId
    }

    let dataCreate = new Date(report.DataCreate)
    let lastDayAccess = this.now.getTime() - dataCreate.getTime()
    let oneDay = 1000 * 60 * 60 * 24

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
  FileEmptyCheck(){
    if (this.reportView.CwrFiles.length > 0){
      return true
    } else return false
  }

  worksEmptyCheck(){
    if (this.reportView.CwrWorks.length > 0){
      return true
    } else return false
  }

  equipEmptyCheck(){
    if (this.reportView.CwrEquipments.length > 0){
      return true
    } else return false
  }

  ngOnDestroy(){
    if (this.getRepSub){
      this.getRepSub.unsubscribe()
    }
    if (this.getNearbyReportSub){
      this.getNearbyReportSub.unsubscribe()
    }
    if (this.getRedRepSub){
      this.getRedRepSub.unsubscribe()
    }
    if(this.reportRedSub){
      this.reportRedSub.unsubscribe()
    }
    if (this.sub){
      this.sub.unsubscribe()
    }
    localStorage.removeItem('nearbyReport')
  }

}
