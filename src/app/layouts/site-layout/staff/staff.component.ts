import { Component, OnInit } from '@angular/core';
import { PersonalComponent } from '../personal/personal.component';
import {SiteLayoutComponent} from '../site-layout.component'
@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  constructor(public personal: SiteLayoutComponent) { }
  staff = JSON.parse(localStorage.getItem('Personal'))
  ngOnInit(): void {
  }

}
