import { Component, OnInit } from '@angular/core';
import {MaterialService} from 'src/app/layouts/classes/material.service'

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements OnInit {
  toggle = true;
  slideNav = true;

  constructor() { }

  openNav(){
    this.slideNav = !this.slideNav;
  }


  ngOnInit() {
    this.toggle = !this.toggle;
    // document.getElementsByClassName('dropdown-content')[0]['style'].display = 'block';
    // let D =
    // document.querySelector('.dropdown-trigger').css.opacity = 1;
    // MaterialService.dropdown();
    // $(".dropdown-trigger").dropdown();
  }

}
