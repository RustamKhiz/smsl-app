import { Component, OnInit,ElementRef,HostListener  } from '@angular/core';
import {User} from "../services/interfaces";
import {Observable} from "rxjs";
import {AutServices} from "../services/aut.services";

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})

export class SiteLayoutComponent implements OnInit {
  //переменные для настройки css стилей
  toggle = true;
  slideNav = true;
  visibleNav = true;

  //переменная для клика вне области
  // clickPos = true;
  // clickClose = false;
  //переменная для сохранения имени пользователя
  public UserName: string


  constructor(private el: ElementRef, private logout: AutServices) {
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
  ngOnInit() {
    this.toggle = !this.toggle;
  }

}
