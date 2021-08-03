import { Component, OnInit } from '@angular/core';
import {MaterialService} from 'src/app/layouts/classes/material.service'

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements OnInit {

  

  constructor() { }

  ngOnInit() {
    // let D =
    // document.querySelector('.dropdown-trigger').css.opacity = 1;
    // MaterialService.dropdown();
    // $(".dropdown-trigger").dropdown();
  }

}
