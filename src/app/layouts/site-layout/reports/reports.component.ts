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
  navTest(){
    this.router.navigate(["/site"])
  }
  ngOnInit() {

  }

}
