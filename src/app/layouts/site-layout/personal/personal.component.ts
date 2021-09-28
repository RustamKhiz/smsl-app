import { Component, OnInit } from '@angular/core';
import {SiteLayoutComponent} from '../../site-layout/site-layout.component'

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  
  constructor(pers: SiteLayoutComponent) {
    
   }
  
  ngOnInit(): void {
  }

}
