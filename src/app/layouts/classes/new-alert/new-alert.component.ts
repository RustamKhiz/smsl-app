import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from '@microsoft/signalr';
import { Observable, Subscription } from 'rxjs';
import { ReportGet } from '../../services/report-get.service';
// import { Alert } from '../../services/interfaces';
import { SignalService } from '../../services/signalR.services';

export class Alert{
  constructor(  public title: string,
                public number: number,
                public subTitle: string,
                public desc: string,
                public logo: string

  ){}
}

@Component({
  selector: 'app-new-alert',
  templateUrl: './new-alert.component.html',
  styleUrls: ['./new-alert.component.css']
})
export class NewAlertComponent implements OnInit, OnDestroy {

  constructor(private signalAlert: SignalService, private repGet: ReportGet, private router: Router) { }

  // @Input() public title = ""
  // @Input() public number = 0
  // @Input() public subTitle = ""
  // @Input() public desc = ""



  logoTest = ""
  exampleLogo = this.logoTest

  example = [
  ]
  ngOnInit() {
    if (JSON.parse(localStorage.getItem('GeneralLocations')) !== null){
      this.logoTest = JSON.parse(localStorage.getItem('GeneralLocations'))[0].Logo
    }
    this.signalAlert.addTransferChartDataListener = () => {
      this.signalAlert.connection.on('CwrAlert', (NewReport) => {
        console.log("CwrAlert", NewReport)
        let userId = JSON.parse(localStorage.getItem('Id'))
        if (userId !== NewReport.userId){
          if (NewReport.action == "NewReport"){
            let title = "Новый отчет!"
            let number = NewReport.id
            let subTitle = JSON.parse(localStorage.getItem('Locations')).find(x => x.Id == NewReport.subLocationId).Name
            let desc = JSON.parse(localStorage.getItem('Personal')).find(x => x.Id == NewReport.userId).SmalFio
            let logo = ""
            this.example.push(new Alert(title, number, subTitle, desc, logo))
          }
        }
      })
    }
  }
  addToAlert(title, number, subTitle, desc){
    let ex = {title: title, number: number, subTitle: subTitle, desc: desc, logo: this.logoTest}

    this.example.push(ex)
    console.log("ex: ", ex)
  }
  // addToAlert(){

  // }
  closeAlert(id){
    return this.example.splice(id, 1)
  }
  RepGetSub: Subscription
  openAlert(id){
      this.RepGetSub = this.repGet.repGetNearby(id).subscribe((report) => {
      console.log("reportViewData: ", report)
      let newReportIdData = JSON.stringify(report)
      localStorage.setItem('ReportViewData', newReportIdData)
      this.router.navigate(['/view-report'])
    },
    () => {
      console.log('Report Get error')
    }
    )

  }
  ngOnDestroy(){
    if(this.RepGetSub){
      this.RepGetSub.unsubscribe()
    }
  }
}
