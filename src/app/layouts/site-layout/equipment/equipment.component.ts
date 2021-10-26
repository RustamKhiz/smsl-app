import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {

  constructor() {
    this.appendItems(0, this.sum);
  }

  equipmentData = JSON.parse(localStorage.getItem('Mashines'))
  equipment: any [] = []

  sum = 6;
  throttle = 600;
  scrollDistance = 1;

  addItems(startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
      this.equipment.push(this.equipmentData[i]);
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
