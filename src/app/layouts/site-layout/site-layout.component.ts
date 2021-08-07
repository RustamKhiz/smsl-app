import { Component, OnInit } from '@angular/core';
import {User} from "../services/interfaces";
import {Observable} from "rxjs";

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})

export class SiteLayoutComponent implements OnInit {
  //переменные для настройки css стилей
  toggle = true;
  slideNav = true;

  //переменная для сохранения имени пользователя
  public UserName: string


  constructor() {
    //сохроняем имя пользователя из localSt
    this.UserName = localStorage.getItem('UserName');
  }

  //метод для вызова меню-бургера
  openNav(){
    this.slideNav = !this.slideNav;
  }

  //метод для вызова настроек профиля
  ngOnInit() {
    this.toggle = !this.toggle;
  }

}
