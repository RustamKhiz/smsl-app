import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader-popup',
  templateUrl: './loader-popup.component.html',
  styleUrls: ['./loader-popup.component.css']
})
export class LoaderPopupComponent implements OnInit {

  constructor() { }
  @Input() public popLoader = true
  @Input() public loading = true
  ngOnInit(): void {
  }

}
