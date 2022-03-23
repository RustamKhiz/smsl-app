import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-major',
  templateUrl: './major.component.html',
  styleUrls: ['./major.component.css', 'major-media.component.css']
})
export class MajorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  onMap(){
    let iframe = document.getElementById('map')
    console.log('iframe: ', iframe)
  }
}
