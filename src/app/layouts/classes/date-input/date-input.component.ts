import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements OnInit {

  @Output() SelectFromDate: EventEmitter<any> = new EventEmitter();
  @Output() SelectToDate: EventEmitter<any> = new EventEmitter();

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  FromDate: string
  ToDate: string
  DateOnChange(event){
    event.value
    console.log("event.value", event.value)
    this.FromDate = ""
    this.ToDate = ""

  }
  DataSub(){
    this.FromDate = this.range.get("start").value
    this.ToDate = this.range.get("end").value
    console.log("date FromDate: ", this.FromDate)
    console.log("date ToDate: ", this.ToDate)
    this.SelectFromDate.emit({value: this.FromDate})
    this.SelectToDate.emit({value: this.ToDate})

  }
  constructor() { }

  ngOnInit(): void {
  }

}
