import { AfterViewInit, Component, EventEmitter, Injectable, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Dropdown, NewDropdown } from '../../services/interfaces'
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-dropdown-select',
  templateUrl: './dropdown-select.component.html',
  styleUrls: ['./dropdown-select.component.css']
})
export class DropdownSelectComponent implements OnInit {
  @Input() public ItemsData: NewDropdown[];
  @Input() public placeholder;
  /** control for the selected bank */
  @Input() public ItemsCtrl: FormControl = new FormControl('', Validators.required);
  @Input() public setValue = "абракадабра";
  @Input() display: boolean = false
  /** control for the MatSelect filter keyword */
  public ItemsFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredItems: ReplaySubject<NewDropdown[]> = new ReplaySubject<NewDropdown[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  public _onDestroy = new Subject<void>();

  constructor() { }

  ngOnInit() {

    this.filteredItems.next(this.ItemsData.slice());
    this.ItemsFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
   public setInitialValue() {
    this.filteredItems
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: NewDropdown, b: NewDropdown) => a && b && a === b;
      });
  }

  public filterBanks() {
    if (!this.ItemsData) {
      return;
    }
    // get the search keyword
    let search = this.ItemsFilterCtrl.value;
    if (!search) {
      this.filteredItems.next(this.ItemsData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredItems.next(
      this.ItemsData.filter(bank => bank.Name.toLowerCase().indexOf(search) > -1)
    );
  }

  // @Input() SetValue(ValueItem){
  //   this.ItemsCtrl.setValue(ValueItem);
  // }
  @Output() itemSelect: EventEmitter<any> = new EventEmitter();
  ItemName: string = ""
  ItemId: number = 0
  SmallName: string =""
  itemFio: string = ""
  FullNameNumber: string = ""
  SelectionOnChange(event){

    this.ItemName = ""
    this.ItemName = event.value.Name
    // this.SmallName = ""
    // this.SmallName = event.value.SmallName
    this.ItemId = 0
    this.ItemId = event.value.Id
    // this.itemFio = ""
    // this.itemFio = event.value.Fio
    // this.FullNameNumber = event.value.FullName + " " + event.value.Number
    // console.log("ItemName: ", this.ItemName)
    // console.log("ItemId: ", this.ItemId)
    console.log("itemFio: ", this.itemFio)
    this.itemSelect.emit({valueName: this.ItemName, valueId: this.ItemId})
  }

  dropCH(Data, event, ctrl){

    for (let i = 0; i < Data.length; i++) {
      if (Data[i].Id == event){
        ctrl.setValue(Data[i]);
      }

    }

  }
}
