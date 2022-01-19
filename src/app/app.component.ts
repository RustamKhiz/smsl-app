import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { afterlogServices } from './layouts/services/afterlog.services';
import { AutServices } from './layouts/services/aut.services';
import { Mashines, Personals } from './layouts/services/interfaces';
import { SignalService } from './layouts/services/signalR.services';
import { TokenCheckAlive } from './layouts/services/token-check-alive.service';
//require('angular-activity-monitor')
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private aut: AutServices, private signal: SignalService, private afteraut: afterlogServices, private router: Router, private tokenCheck: TokenCheckAlive){

  }
  pers: Personals[]
  mashin: Mashines[]
  aSub: Subscription
  aSubCheckToken: Subscription

  popLoader = true
  loading = false; //переменная для лоадера
  Method = [
    {Id: 0, Name: "РК"},
    {Id: 1, Name: "ВИК"},
    {Id: 2, Name: "УЗК"},
    {Id: 3, Name: "ПВК"},
    {Id: 4, Name: "ЦРК"},
    {Id: 5, Name: "Мех. испытания"},
    {Id: 6, Name: "МПД"},
    {Id: 7, Name: "OK (PMI)"},
    {Id: 8, Name: "ЭК"},
    {Id: 9, Name: "Адгезия"},
    {Id: 10, Name: "Сплошность"},
    {Id: 11, Name: "Прочее"},
  ]
  PesonalStatuses = [
    {Id: 2, DisplayName: "Руководство участком", Description: null, IsWork: false},
    {Id: 3, DisplayName: "Водитель", Description: null, IsWork: false},
    {Id: 4, DisplayName: "Проведение контроля", Description: null, IsWork: false},
    {Id: 5, DisplayName: "Обработка результатов", Description: null, IsWork: false},
    {Id: 6, DisplayName: "Приёмка", Description: null, IsWork: false},
    {Id: 7, DisplayName: "Проявка", Description: null, IsWork: false},
    {Id: 8, DisplayName: "ПТО", Description: null, IsWork: false},
    {Id: 9, DisplayName: "Прочее", Description: null, IsWork: false},
    {Id: 14, DisplayName: "Склад", Description: null, IsWork: false}
  ]
  PesonalStatusesWork = [
    {Id: 10, DisplayName: "Больничный", Description: null, IsWork: true},
    {Id: 11, DisplayName: "Выходной", Description: null, IsWork: true},
    {Id: 12, DisplayName: "Прогул", Description: null, IsWork: true},
    {Id: 13, DisplayName: "Дорога", Description: null, IsWork: true},
    {Id: 15, DisplayName: "Карантин", Description: null, IsWork: true},
    {Id: 16, DisplayName: "Отпуск", Description: null, IsWork: true},
    {Id: 18, DisplayName: "Работа", Description: null, IsWork: true}
  ]

  DontActiveTime: number = 0

  Action(){
    let timeout = 3000;
    let lastActiveTimestamp = 0;
    let userIsActive = false;
    this.DontActiveTime = 0;
    window.addEventListener('mousemove', this.active);
    window.addEventListener('keypress', this.active);
    window.addEventListener('click', this.active);

    setInterval(this.checkUserIsActive, 1000);
    this.active();
  }
  checkUserIsActive() {
    this.DontActiveTime += 1
    // console.log(this.DontActiveTime,"DontActiveTime")
    localStorage.setItem('DontActiveTime', JSON.stringify(this.DontActiveTime))
  }
  active() {
    this.DontActiveTime = 0
   // console.log(this.DontActiveTime,"DontActiveTime")
  }
  ngOnInit(){

    // console.log("OnInit")
    this.Action()
    this.loading = true
    const potentialToken = localStorage.getItem('aut-token')
    const potentialHash = localStorage.getItem('ConnectionHash')
    if (potentialToken !== null){
      this.aSubCheckToken = this.tokenCheck.tokenCheck(potentialToken).subscribe((check) => {
        console.log("check", check)
        if (check == false){
          this.aut.logout()
          this.router.navigate(['/aut'])
        }
      },
      () => {
        // this.aut.logout()
        // this.router.navigate(['/aut'])
        console.log("token check error")
      }
      )

      this.aut.setToken(potentialToken)
      this.signal.connect();
      this.signal.onConnect.subscribe((c, n) => {
          // console.log(`AutServices ${c} hash ${n} `)
          localStorage.setItem('ConnectionHash', c)

          //Получение всех данных
          this.aSub = this.afteraut.afterLog().subscribe(
            (res)=> {
              // console.log("afterlog working!")
              console.log("dataload: load", res)
              // Получаем персонал из afterLog
              const persData = JSON.stringify(this.afteraut.newPersonals)
              localStorage.setItem('Personal', persData)
              this.pers = JSON.parse(localStorage.getItem('Personal'))

              //Получаем оборудование из afterLog
              const MashinData = JSON.stringify(this.afteraut.newMashines)
              localStorage.setItem('Mashines', MashinData)
              this.mashin = JSON.parse(localStorage.getItem('Mashines'))
              //Получаем заказчиков из afterlog
              const CustomersData = JSON.stringify(this.afteraut.newCustomers)
              localStorage.setItem('Customers', CustomersData)
              //Получаем GeneralLocations из afterlog
              const GeneralLocationsData = JSON.stringify(this.afteraut.newGeneralLocations)
              localStorage.setItem('GeneralLocations', GeneralLocationsData)
              //Получаем Locations из afterlog
              const LocationsData = JSON.stringify(this.afteraut.newLocactions)
              localStorage.setItem('Locations', LocationsData)
              //Получаем config
              const Config = JSON.stringify(this.afteraut.config)
              localStorage.setItem('Config', Config)
              //Получение данных локально, до получение их с соответствующего запроса (во избежании ошибок)
              localStorage.setItem('MethodControl', JSON.stringify(this.Method))
              localStorage.setItem('PesonalStatuses', JSON.stringify(this.PesonalStatuses))
              localStorage.setItem('PesonalStatusesWork', JSON.stringify(this.PesonalStatusesWork))
              this.loading = false

          },
            (error) => {
              console.log("afterlog dont work")
              console.log("error:",error)
              this.loading = false

            },()=> {
              // console.log("subscribe complite")
            }
          )
        }
      );

    } else{
      this.aut.logout()
      this.router.navigate(['/aut'])
      this.loading = false
    }
    //else location.reload()
    // this.loading = false

  }
  ngAfterViewInit(){
    console.log("ngAfterViewInit is work!")
    const potentialToken = localStorage.getItem('aut-token')
    if (potentialToken !== null){

    }
  }
  ngOnDestroy(){
    if(this.aSub){
      this.aSub.unsubscribe()
    }
    if(this.aSubCheckToken){
      this.aSubCheckToken.unsubscribe()
    }
  }
}
