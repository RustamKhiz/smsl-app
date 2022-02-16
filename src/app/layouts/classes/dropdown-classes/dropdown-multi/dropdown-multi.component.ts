import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit, Input, Injectable, Output, EventEmitter } from '@angular/core';
import {User, Personals, Mashines,Report, NewDropdown } from "../../../services/interfaces";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { take, takeUntil } from 'rxjs/operators';
import { DropDownMultiItem } from '../../../services/interfaces';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-dropdown-multi',
  templateUrl: './dropdown-multi.component.html',
  styleUrls: ['./dropdown-multi.component.css']
})
export class DropdownMultiComponent implements OnInit, OnDestroy, AfterViewInit  {


  pers = JSON.parse(localStorage.getItem('Personal'));
  equipment = JSON.parse(localStorage.getItem('Mashines'))

  // public Items: DropDownItem[];
  // @Input() protected persData: Personals[] = this.pers;
  // @Input() public allPersSize = this.pers.length;
  @Input() public ItemsData: NewDropdown[];
  @Input() public allItemsSize ;
  @Input() public ItemsMultiCtrl: FormControl = new FormControl('', Validators.required);
  public ItemsMultiFilterCtrl: FormControl = new FormControl();
  public filteredItemsMulti: ReplaySubject<NewDropdown[]> = new ReplaySubject<NewDropdown[]>(1);
  public filteredItemsCache: NewDropdown[] = [];

  //placeholder
  @Input() placeholder: string = "Тест"

  isIndeterminate = false;
  isChecked = false;

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  public _onDestroy = new Subject<void>();

  constructor() { }

  ngOnInit() {
    // set initial selection
    // this.ItemsMultiCtrl.setValue([
    //   this.ItemsData[10],
    //   this.ItemsData[11],
    //   this.ItemsData[12],
    // ]);

     // load the initial bank list
     this.filteredItemsMulti.next(this.ItemsData.slice());

     // listen for search field value changes
     this.ItemsMultiFilterCtrl.valueChanges
       .pipe(takeUntil(this._onDestroy))
       .subscribe(() => {
         this.filterBanksMulti();
         this.setToggleAllCheckboxState();
       });

       // listen for multi select field value changes
     this.ItemsMultiCtrl.valueChanges
     .pipe(takeUntil(this._onDestroy)).subscribe(() => {
       this.setToggleAllCheckboxState();
     });
     this.Submit()

  }
  //multiDropdowmSettings
  ngAfterViewInit() {
    this.setInitialValue();
  }
  toggleSelectAll(selectAllValue: boolean) {
    this.filteredItemsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.ItemsMultiCtrl.patchValue(val);
        } else {
          this.ItemsMultiCtrl.patchValue([]);
        }
      });
  }

  public setInitialValue() {
    this.filteredItemsMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: NewDropdown, b: NewDropdown) => a && b && a === b;
      });
  }
  public filterBanksMulti() {
    if (!this.ItemsData) {
      return;
    }

    let search = this.ItemsMultiFilterCtrl.value;
    if (!search) {
      this.filteredItemsCache = this.ItemsData.slice();
      this.filteredItemsMulti.next(this.filteredItemsCache);
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredItemsCache = this.ItemsData.filter(ItemsData => ItemsData.Name.toLowerCase().indexOf(search) > -1);
    this.filteredItemsMulti.next(this.filteredItemsCache);
  }
  public setToggleAllCheckboxState() {
    let filteredLength = 0;
    if (this.ItemsMultiCtrl && this.ItemsMultiCtrl.value) {
      this.filteredItemsCache.forEach(el => {
        if (this.ItemsMultiCtrl.value.indexOf(el) > -1) {
          filteredLength++;
        }
      });
      this.isIndeterminate = filteredLength > 0 && filteredLength < this.filteredItemsCache.length;
      this.isChecked = filteredLength > 0 && filteredLength === this.filteredItemsCache.length;
    }
  }
  ngOnDestroy(){
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  @Output() itemSelect: EventEmitter<any> = new EventEmitter();
  NumberId: number[] = []
  NameRu: string [] = []
  Name: string [] = []
  SelectionOnChange(event){
    // console.log("event test", event.value)
    this.NumberId = []
    this.Name = []
    for (let i = 0; i < event.value.length; i++) {
      this.NumberId.push(event.value[i].Id)
      this.Name.push(event.value[i].Name)
    }
    // console.log("this.NumberId: ", this.NumberId)
    // console.log("this.Name: ", this.Name)
    this.itemSelect.emit({valueId: this.NumberId, valueName: this.Name})
  }

  dropCH(Data, event, ctrl){
    // console.log("dropCH")
    // console.log("this.setValue: ", event)
    // console.log("Data", Data)
    let DataName: NewDropdown [] = []
    // console.log("DataName", DataName)
    ctrl.setValue('')
    // console.log("test ctrl.setValue: ",ctrl.value)

    for (let i = 0; i < Data.length; i++) {
      for (let j = 0; j < event.length; j++) {
        if (Data[i].Id == event[j]){
          // console.log("Data[i].Name: ", Data[i] )
          DataName.push(Data[i])
        }
      }
    }
    ctrl.setValue(
      // Data[i].Name
      DataName
    );

  }



  @Input() SetValue(){

  }
  Submit(){
    // console.log("ItemsMultiCtrl: ",this.ItemsMultiCtrl.value.length )
    // if(this.ItemsMultiCtrl.value.length > 0){
    //   for (let i = 0; i < this.ItemsMultiCtrl.value.length; i++) {
    //     console.log("Submit! Id: ", this.ItemsMultiCtrl.value[i].Id)
    //     this.NumberId.push(this.ItemsMultiCtrl.value[i].Id)
    //   }
    //   console.log("NumberId: ", this.NumberId)
    // }

  }

}
