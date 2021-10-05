import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {SiteLayoutComponent} from '../../site-layout/site-layout.component'
import {Report} from './../../services/interfaces'
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) {}
  public rep: Report
  formSub: FormGroup
  test: any
  pers = JSON.parse(localStorage.getItem('Personal'))
  ngOnInit() {
    this.formSub = new FormGroup({
      GeneralLocation: new FormControl(null, [Validators.required]),
      Person: new FormControl (null, [Validators.required]),
      Method: new FormControl (null, [Validators.required]),
      Shown: new FormControl (null, [Validators.required])
    })
    this.test = this.formSub.value
  }
  // testMet(rep: Report): Observable<{GeneralLocation: string, Person: string, Method: string, Shown: string}>{
  //   return rep<{GeneralLocation: string, Person: string, Method: string, Shown: string}>
  // }
  reportSubmit(){

  }
}
