import { Component, OnDestroy, OnInit } from '@angular/core';
import {User, Personals, Mashines} from "../../services/interfaces";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReportAll } from '../../services/reports-all.service';
import { TokenCheckAlive } from '../../services/token-check-alive.service';
import { AutServices } from '../../services/aut.services';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css', 'reports-media.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private repAll: ReportAll, private aut: AutServices, private tokenCheck: TokenCheckAlive) {
    this.Filter.FromDate = this.yesterday
    this.Filter.ToDate = this.today
  }

  activeTab = true
  activeTab2 = false
  navTest(){
    this.router.navigate(["/reports/list"])
    this.activeTab = true
    this.activeTab2 = false
  }
  aSubCheckToken: Subscription
  navTest2(){
    this.router.navigate(["/reports/add-report"])
    this.activeTab = false
    this.activeTab2 = true
    const potentialToken = localStorage.getItem('aut-token')
    this.aSubCheckToken = this.tokenCheck.tokenCheck(potentialToken).subscribe((check) => {
      console.log("check", check)
      if (check == false){
        this.aut.logout()
        this.router.navigate(['/aut'])
      }
    },
    () => {
      this.aut.logout()
      this.router.navigate(['/aut'])
      console.log("token check error")
    }
    )
  }
  Filter = { // базовая модель фильтра
    ReportId: 0,
    FromDate: null,
    ToDate: null,
    ChiefIds: null,
    GeneralLocIds: null,
    SubLocIds: null
  }

  aSub: Subscription; // Переменная для отписки от потока
  //работа со временем и датами для фильтров
  now = new Date();
  hours = this.now.getHours() * 60 * 60 * 1000
  minutes = this.now.getMinutes() * 60 * 1000
  seconds = this.now.getSeconds() * 1000
  milsec = this.now.getMilliseconds()
  AllMilSec = this.hours + this.minutes + this.seconds + this.milsec
  today = new Date (this.now.getTime() - (this.AllMilSec))
  yesterday = new Date(this.now.getTime() - (1000 * 60 * 60 * 24) - (this.AllMilSec))
  // конец работы со временем и датами для фильтров

  ngOnInit() {
    this.activeTab = true
    this.activeTab2 = false
    if (localStorage.getItem('ReportAll') == null){
      this.aSub = this.repAll.reportAll(this.Filter).subscribe(
        (AllData) => {
          // console.log("Filter is work! AllData", AllData)
          //Получаем и сохраняем статусы пользователя для создания отчётов
          let PesonalStatusesWork: any [] = [];
          let PesonalStatuses: any [] = [];
          for (let i = 0; i < AllData.CwrPesonalStatuses.length; i++) {
            if (AllData.CwrPesonalStatuses[i].IsWork == true){
              PesonalStatusesWork.push(AllData.CwrPesonalStatuses[i])
            } else {
              PesonalStatuses.push(AllData.CwrPesonalStatuses[i])
            }
          }
          const PesonalStatusesWorkC = JSON.stringify(PesonalStatusesWork)
          localStorage.setItem('PesonalStatusesWork', PesonalStatusesWorkC)

          const PesonalStatusesC = JSON.stringify(PesonalStatuses)
          localStorage.setItem('PesonalStatuses', PesonalStatusesC)
        },
        (error) => {
          console.log("Filter don`t work!")
        }
      )
    }

  }
  ngOnDestroy(){
    if (this.aSubCheckToken){
      this.aSubCheckToken.unsubscribe()
    }
  }

}
