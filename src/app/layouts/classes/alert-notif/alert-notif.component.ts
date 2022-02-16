import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-notif',
  templateUrl: './alert-notif.component.html',
  styleUrls: ['./alert-notif.component.css']
})
export class AlertNotifComponent implements OnInit {

  constructor() { }
  @Input() public title: string = "Пример заголовка"
  @Input() public subtitle: string = "Пример подзаголовка"
  @Input() public btnText: string = "Продолжить"

  @Input() public repDeleteWind: boolean = true

  onNext(){
    this.repDeleteWind = false
  }
  ngOnInit(): void {
  }

}
