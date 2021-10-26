import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  constructor() {
    this.appendItems(0, this.sum);
   }
  staffData = JSON.parse(localStorage.getItem('Personal'))
  staff: any [] = []

  sum = 6;
  throttle = 500;
  scrollDistance = 1;

  addItems(startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
      this.staff.push(this.staffData[i]);
    }
  }
  appendItems(startIndex, endIndex) {
    this.addItems(startIndex, endIndex);
  }
  onScrollDown(ev) {
    console.log('scrolled down!!', ev);
    const start = this.sum;
    this.sum += 3;
    this.appendItems(start, this.sum);
  }

  ngOnInit(): void {
  }

}
