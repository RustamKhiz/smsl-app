import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader-logo',
  templateUrl: './loader-logo.component.html',
  styleUrls: ['./loader-logo.component.css']
})
export class LoaderLogoComponent implements OnInit {

  constructor() { }

  @Input() show: boolean = false

  ngOnInit(): void {
  }

}
