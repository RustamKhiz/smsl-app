import { Component, OnInit } from '@angular/core';
import {User, Personals, Mashines} from "../../services/interfaces";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export class NameComplWorks{
  constructor(public Method: string,
              public Customer: string,
              public Staff: {Id: any, Fio: string},
              public Equipment: string,
              public Shown: number,
              public Made: number,
              public Comment: string)
  { }
}
export class ReportPers{
  constructor(public Staff2: {Id: any, Fio: string},
              public Func: string
  ){}
}
export class ReportEquip{
  constructor(public Equipment2: string,
              public Working: string
  ){}
}
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  constructor() { }
  pers = JSON.parse(localStorage.getItem('Personal'));
  // equipment = JSON.parse(localStorage.getItem('Mashines'))

  Method: string = "";
  Customer: string = "";
  Staff = {Id: "", Fio: ""}
  Equipment: string = "";
  Shown: number = 0;
  Made: number = 0;
  Comment: string = "";
  
  reportsCards: NameComplWorks[] = []; 

  form1: FormGroup

  addOnPopup(){
    console.log(this.Staff)
    // const test = JSON.parse(this.Staff)
    // const test = JSON.stringify(this.Staff)
    // const test2 = JSON.parse(test)
    // this.Staff = test2;
    this.reportsCards.push(new NameComplWorks(this.Method, this.Customer, this.Staff, this.Equipment, this.Shown, this.Made, this.Comment))
    console.log('reportsCards:', this.reportsCards)
    console.log('Staff:', this.Staff.Fio)
    // console.log('test:',test)
    // console.log('test2:',test2)

    this.popupOpen() 
    this.form1.reset(); 
  }
  Staff2: {Id: any, Fio: string};
  Func: string = "";

  reportPers: ReportPers[] = []
  form2: FormGroup
  addOnPopup2(){
    this.reportPers.push(new ReportPers(this.Staff2, this.Func))
    this.popupOpen2();
    this.form2.reset(); 
  }

  Equipment2: string = ""
  Working: string = ""

  form3: FormGroup
  reportEquip: ReportEquip[] = []
  addOnPopup3(){
    this.reportEquip.push(new ReportEquip(this.Equipment2, this.Working))
    this.popupOpen3();
    this.form3.reset(); 
  }

  dropdownListPers = [];
  dropdownListEquip = [];

  requiredField: boolean = false;

  selectedItems = [];
  dropdownSettingsPers:IDropdownSettings={};
  dropdownSettingsEquip:IDropdownSettings={};

  ngOnInit() {
    this.form1 = new FormGroup({
      Method: new FormControl('', Validators.required),
      Customer: new FormControl('', Validators.required),
      Staff: new FormControl('', Validators.required),
      Equipment: new FormControl('', Validators.required),
      Shown: new FormControl('', Validators.required),
      Made: new FormControl('', Validators.required),
      Comment: new FormControl(''),
    })
    this.form2 = new FormGroup({
      Staff2: new FormControl('',Validators.required),
      Func: new FormControl('',Validators.required),
      Comment: new FormControl(''),
    })
    this.form3 = new FormGroup({
      Equipment2: new FormControl('', Validators.required),
      Working: new FormControl('', Validators.required),
      Comment: new FormControl(''),
    })
    this.dropdownListPers = JSON.parse(localStorage.getItem('Personal'));
    this.dropdownListEquip = JSON.parse(localStorage.getItem('Mashines'));
    
    this.selectedItems=[
      { Id: 3, Fio: 'Pune' },
      { Id: 4, Fio: 'Navsari' }
    ] 
    
    this.dropdownSettingsPers = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Fio',
      allowSearchFilter: true,
      enableCheckAll: false,
      searchPlaceholderText:'Поиск',
      itemsShowLimit: 2,
    };
    this.dropdownSettingsEquip = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      allowSearchFilter: true,
      enableCheckAll: false,
      searchPlaceholderText:'Поиск',
      itemsShowLimit: 2
    };
    
    // this.setStatus()
  }
  onItemSelect(item: any) {
    // console.log(item);
    // this.Staff = item.Fio
  }
  setStatus() {
    this.selectedItems.length > 0
      ? (this.requiredField = true)
      : (this.requiredField = false);
  }



  tabsBg = true;
  tabsBg2 = false;
  tabsBg3 = false;

  popOpen = false; 
  popOpen2 = false; 
  popOpen3 = false; 


  tabsText = true;

  cardAct = true;
  cardAct2 = false;
  cardAct3 = false;

  tabsClick(){
    this.tabsBg = true;
    this.tabsBg2 = false;
    this.tabsBg3 = false;
    
    this.cardAct = true;
    this.cardAct2 = false;
    this.cardAct3 = false;
  }
  tabsClick2(){
    this.tabsBg2 = true;
    this.tabsBg = false;
    this.tabsBg3 = false;

    this.cardAct2 = true;
    this.cardAct = false;
    this.cardAct3 = false;
  }
  tabsClick3(){
    this.tabsBg3 = true;
    this.tabsBg = false;
    this.tabsBg2 = false;

    this.cardAct3 = true;
    this.cardAct = false;
    this.cardAct2 = false;
  }
  popupOpen(){
    this.popOpen = !this.popOpen
  }
  popupOpen2(){
    this.popOpen2 = !this.popOpen2
  }
  popupOpen3(){
    this.popOpen3 = !this.popOpen3
  }
  
  
} 
