import { Component, OnInit } from '@angular/core';
import {User, Personals, Mashines} from "../../services/interfaces";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  constructor(private router: Router) { }
  activeTab = true
  activeTab2 = false
  navTest(){
    this.router.navigate(["/reports/list"])
    this.activeTab = true
    this.activeTab2 = false
  }
  navTest2(){
    this.router.navigate(["/reports/add-report"])
    this.activeTab = false
    this.activeTab2 = true
  }
  ngOnInit() {
    this.activeTab = true
    this.activeTab2 = false
  }

}
