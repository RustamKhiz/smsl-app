import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  tabsBg = true;
  tabsText = true;

  constructor() { }

  tabsClick(){
    this.tabsBg = !this.tabsBg;
    this.tabsText = !this.tabsText;
  }

  ngOnInit(): void {
  }

}
