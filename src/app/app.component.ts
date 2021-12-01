import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { afterlogServices } from './layouts/services/afterlog.services';
import { AutServices } from './layouts/services/aut.services';
import { Mashines, Personals } from './layouts/services/interfaces';
import { SignalService } from './layouts/services/signalR.services';
//require('angular-activity-monitor')
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private aut: AutServices, private signal: SignalService, private afteraut: afterlogServices, private router: Router){

  }
  pers: Personals[]
  mashin: Mashines[]
  aSub: Subscription

  popLoader = true
  loading = false; //переменная для лоадера

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

    this.Action()
    this.loading = true
    const potentialToken = localStorage.getItem('aut-token')
    const potentialHash = localStorage.getItem('ConnectionHash')
    if (potentialToken !== null){
      this.aut.setToken(potentialToken)
      this.signal.connect();
      this.signal.onConnect.subscribe((c, n) => {
          console.log(`AutServices ${c} hash ${n} `)
          localStorage.setItem('ConnectionHash', c)

          //Получение всех данных
          this.aSub = this.afteraut.afterLog().subscribe(
            (res)=> {
              console.log("afterlog working!")
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
              this.loading = false

          },
            (error) => {
              console.log("afterlog dont work")
              console.log("error:",error)
              this.loading = false

            },()=> {
              console.log("subscribe complite")
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
    this.loading = false

  }
  ngOnDestroy(){
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }
}
