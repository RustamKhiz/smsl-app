import { Component, OnInit,ElementRef,HostListener, Input, OnDestroy  } from '@angular/core';
import {User, Personals, Mashines} from "../services/interfaces";
import {Observable, Subscription} from "rxjs";
import {AutServices} from "../services/aut.services";
import {afterlogServices} from "../services/afterlog.services";
import { JsonHubProtocol } from '@microsoft/signalr';
import {FormControl} from '@angular/forms';
@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css', './site-layout-media.component.css']
})

export class SiteLayoutComponent implements OnInit, OnDestroy {

  //переменные для настройки css стилей
  toggle = true;
  slideNav = true;
  visibleNav = true;
  aSub: Subscription;
  //переменная для сохранения имени пользователя
  userData = JSON.parse(localStorage.getItem('UserData'))
  UserName: string = ""

  //переменные для сохранения сотрудников и оборудования
  pers: Personals[]
  mashin: Mashines[]

  constructor(private el: ElementRef, private logout: AutServices, public afteraut: afterlogServices) {
    //сохроняем имя пользователя из localSt
    this.UserName = localStorage.getItem('UserName');

  }
  lout(){
    this.logout.setToken(null)
    localStorage.clear()
    location.reload()
  }
  openNav(){
    this.slideNav = !this.slideNav;
    this.visibleNav = !this.visibleNav;
  }
  closeNav(){
    this.slideNav = true;
    this.visibleNav = true;
    this.toggle = false
  }
  //метод для вызова настроек профиля
  conutAfter = 0;
  ngOnInit() {

    if (localStorage.getItem('reloadItem') !== null){
      location.reload()
      localStorage.removeItem('reloadItem')
    }

    this.UserName = this.userData.MyPerson.Personal.EMail
    this.toggle = !this.toggle;
    console.log("TEST NGONINIT")

    //вызов get запрса на получение всех данных
    // this.afteraut.afterLog()

     setTimeout(s =>{
      // this.aSub = this.afteraut.afterLog().subscribe(
      //   (res)=> {
      //     console.log("afterlog working!")
      //     console.log("dataload: ", res)
      //     // Получаем персонал из afterLog
      //     const persData = JSON.stringify(this.afteraut.newPersonals)
      //     localStorage.setItem('Personal', persData)
      //     this.pers = JSON.parse(localStorage.getItem('Personal'))
      //     //Получаем оборудование из afterLog
      //     const MashinData = JSON.stringify(this.afteraut.newMashines)
      //     localStorage.setItem('Mashines', MashinData)
      //     this.mashin = JSON.parse(localStorage.getItem('Mashines'))
      //     //Получаем заказчиков из afterlog
      //     const CustomersData = JSON.stringify(this.afteraut.newCustomers)
      //     localStorage.setItem('Customers', CustomersData)
      //     //Получаем GeneralLocations из afterlog
      //     const GeneralLocationsData = JSON.stringify(this.afteraut.newGeneralLocations)
      //     localStorage.setItem('GeneralLocations', GeneralLocationsData)
      //     //Получаем Locations из afterlog
      //     const LocationsData = JSON.stringify(this.afteraut.newLocactions)
      //     localStorage.setItem('Locations', LocationsData)
      // },
      //   (error) => {
      //     console.log("afterlog dont work")
      //     console.log("error:",error)
      //   },()=> {
      //     console.log("subscribe complite")
      //   }
      // )
      // complete().this.afteraut.afterLog().unsubscribe();

    },3000);
    this.pers = JSON.parse(localStorage.getItem('Personal'))
    this.mashin = JSON.parse(localStorage.getItem('Mashines'))
  }
  ngOnDestroy(){
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }
  ngAfterViewInit(){

  }

}
