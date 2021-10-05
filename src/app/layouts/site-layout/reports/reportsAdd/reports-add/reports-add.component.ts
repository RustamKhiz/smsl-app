import { Component, OnDestroy, OnInit } from '@angular/core';
// import {User, Personals, Mashines} from "../../services/interfaces";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReportAdd } from 'src/app/layouts/services/reports-add.services';
import { Router } from '@angular/router';

export class CwrWorks{
  constructor(public MethodControl: string,
              public Customer: {NameRu: string},
              public CwrWorkPersonals:{Personal: {Id: number, Fio: string}},
              public CwrWorkEquipments:{Equipment: {Id: number, Name: string}},
              public Shown: number,
              public Made: number,
              // public Comment?: string
              )
  { }
}
export class CwrPersonals{
  constructor(public Personal: {Id: number, Fio: string},
              public CwrStatusFromPersonals: {CwrPesonalStatus:{ DisplayName: string}},
              // public Comment?: string
  ){}
}
export class CwrEquipments{
  constructor(public Equipment: string,
              public Status: string,
              // public Comment?: string
  ){}
}
export class Report{
  constructor(){}
}
export class GeneralLocation{
  constructor(
              public DisplayName: string

  ){}
}
export class DataReport{
             constructor( public DataReport: number){}
}
@Component({
  selector: 'app-reports-add',
  templateUrl: './reports-add.component.html',
  styleUrls: ['./reports-add.component.css']
})
export class ReportsAddComponent implements OnInit, OnDestroy {
  constructor(private rep: ReportAdd,  private router: Router) { }
  pers = JSON.parse(localStorage.getItem('Personal'));
  equipment = JSON.parse(localStorage.getItem('Mashines'))

  MethodControl: string = "";
  Customer = {NameRu: ""};
  CwrWorkPersonals = {Personal: {Id: 0, Fio: ""}}
  CwrWorkEquipments = {Equipment: {Id: 0, Name: ""}}
  Shown: number = 0;
  Made: number = 0;
  Comment?: string = "";

  reportsCards: CwrWorks[] = [];

  form1: FormGroup

  addOnPopup(){
    this.reportsCards.push(new CwrWorks(this.MethodControl, this.Customer, this.CwrWorkPersonals, this.CwrWorkEquipments, this.Shown, this.Made))
    this.popupOpen()
    this.form1.reset();
  }
  Personal = {Id: 0, Fio: ""};
  CwrStatusFromPersonals = {CwrPesonalStatus:{ DisplayName: ""}}
  Comment2?: string = "";

  reportPers: CwrPersonals[] = []
  form2: FormGroup
  addOnPopup2(){
    this.reportPers.push(new CwrPersonals(this.Personal, this.CwrStatusFromPersonals))
    this.popupOpen2();
    this.form2.reset();
  }

  Equipment: string = "";
  Status: string = "";
  Comment3?:string = "";

  form3: FormGroup
  reportEquip: CwrEquipments[] = []
  addOnPopup3(){
    this.reportEquip.push(new CwrEquipments(this.Equipment, this.Status))
    this.popupOpen3();
    this.form3.reset();
  }

  DataReport: number
  DisplayName: ""

  CwrFiles?: []
  // Comment?: string
  generalLocation: GeneralLocation[]=[]
  dataReport: DataReport[]=[]
  report: Report[]=[]
  formSub: FormGroup;
  aSub: Subscription;

  reportSubmit() {
    this.generalLocation.push(new GeneralLocation(this.DisplayName))
    this.dataReport.push(new DataReport(this.DataReport))

    this.report = this.report.concat(this.generalLocation, this.dataReport, this.reportsCards, this.reportPers, this.reportEquip)
    console.log("report: ", this.report)
    this.aSub = this.rep.reportAdd(this.report).subscribe(
      ()=> this.router.navigate(['/reports/list']),
      error => console.log('Ошибка отправки формы отчета')
    )
  }

  dropdownListPers = [];
  dropdownListEquip = [];

  requiredField: boolean = false;

  selectedItems = [];
  dropdownSettingsPers:IDropdownSettings={};
  dropdownSettingsEquip:IDropdownSettings={};

  ngOnInit() {
    this.form1 = new FormGroup({
      MethodControl: new FormControl('', Validators.required),
      Customer: new FormControl('', Validators.required),
      CwrWorkPersonals: new FormControl('', Validators.required),
      CwrWorkEquipments: new FormControl('', Validators.required),
      Shown: new FormControl('', Validators.required),
      Made: new FormControl('', Validators.required),
      Comment: new FormControl(''),
    })
    this.form2 = new FormGroup({
      Personal: new FormControl('',Validators.required),
      CwrStatusFromPersonals: new FormControl('',Validators.required),
      Comment2: new FormControl(''),
    })
    this.form3 = new FormGroup({
      Equipment: new FormControl('', Validators.required),
      Status: new FormControl('', Validators.required),
      Comment3: new FormControl(''),
    })
    this.formSub = new FormGroup({
      DisplayName: new FormControl('', Validators.required),
      Person: new FormControl('', Validators.required),
      DataReport: new FormControl('', Validators.required),

      MethodControl: new FormControl('', Validators.required),
      Customer: new FormControl('', Validators.required),
      Staff: new FormControl('', Validators.required),
      Equipment: new FormControl('', Validators.required),
      Shown: new FormControl('', Validators.required),
      Made: new FormControl('', Validators.required),
      Comment: new FormControl(''),

      Personal: new FormControl('',Validators.required),
      CwrStatusFromPersonals: new FormControl('',Validators.required),

      Equipment2: new FormControl('', Validators.required),
      Status: new FormControl('', Validators.required),
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


  ngOnDestroy(){
    if (this.aSub){
      this.aSub.unsubscribe()
    }
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
