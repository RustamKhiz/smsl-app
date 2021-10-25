import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
// import {User, Personals, Mashines,Report, Dropdown, NewDropdown } from "../../../../services/interfaces";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReportAdd } from 'src/app/layouts/services/reports-add.services';
import { Router } from '@angular/router';
import { DropdownSelectComponent } from 'src/app/layouts/classes/dropdown-select/dropdown-select.component';
import { DropdownMultiComponent } from 'src/app/layouts/classes/dropdown-classes/dropdown-multi/dropdown-multi.component';
import { DropdownMultiCloneComponent } from 'src/app/layouts/classes/dropdown-classes/dropdown-multi-clone/dropdown-multi-clone.component';
import { ReportRed } from 'src/app/layouts/services/report-red.service';



export class CwrWorks{
  constructor(public Id: number,
              public MethodControl: string,
              public MethodControlId: number,
              public CustomerId: number,
              public Shown: number,
              public Made: number,
              public CwrId: number,
              public CwrWorkPersonals: [{Id: number, PersonalId: number, Fio: string, CwrWorkId: number}],
              public CwrWorkEquipments: [{Id: number, EquipmentId: number, Name: string, CwrWorkId: number}],
              public Customer: string,
              public PersonalName: string,
              public EquipmentName: string,
              public Comment?: string
              )
  { }
}
export class CwrPersonals{
  constructor(public Id: number,
              public PersonalId: number,
              public CwrId: number,
              public Personal: string,
              public CwrStatusFromPersonals: [{ Id: number, CwrStatusId: number, CwrPersonalId: number, DisplayName: string}],
              public PersonalStatus: string,
              public PersonalStatusName: string,
              public Comment?: string
  ){}
}
export class CwrEquipments{
  constructor(public Id: number,
              public EquipmentId: number,
              public Status: string,
              public StatusId: number,
              public CwrId: number,
              public CwrEquipments: string,
              public Comment?: string
  ){}
}
export class NewDropdown {
  constructor(
              public Id: number,
              public Name: string,
              public Display: boolean,
              public IsSelect: boolean
  ) {}
}
// // export class Report{
// //   constructor(){}
// // }
// export class GeneralLocation{
//   constructor(
//               public DisplayName: string

//   ){}
// }
// export class DataReport{
//              constructor( public DataReport: number){}
// }
@Component({
  selector: 'app-reports-add',
  templateUrl: './reports-add.component.html',
  styleUrls: ['./reports-add.component.css']
})
export class ReportsAddComponent implements OnInit, AfterViewInit, OnDestroy {
  pers = JSON.parse(localStorage.getItem('Personal'));
  PersData: NewDropdown [] = [];
  equipment = JSON.parse(localStorage.getItem('Mashines'))
  EquipData: NewDropdown [] = [];
  location = JSON.parse(localStorage.getItem('Locations'))
  LocationData: NewDropdown [] = [];
  customer = JSON.parse(localStorage.getItem('Customers'))
  CustomerData: NewDropdown [] = [];
  status = JSON.parse(localStorage.getItem('PesonalStatuses'))
  StatusData: NewDropdown [] = [];
  Method = [
    {Id: 0, Name: "РК"},
    {Id: 1, Name: "ВИК"},
    {Id: 2, Name: "УЗК"},
    {Id: 3, Name: "ПВК"},
    {Id: 4, Name: "Мех. испытания"},
    {Id: 5, Name: "МПД"},
    {Id: 6, Name: "OK (PMI)"},
    {Id: 7, Name: "ЭК"},
    {Id: 8, Name: "Адгезия"},
    {Id: 9, Name: "Сплошность"},
    {Id: 10, Name: "Прочее"},
  ]
  MethodData: NewDropdown [] = [];
  StatusEq = [
    {Id: 0, Name: "Исправен"},
    {Id: 1, Name: "Не исправен"},
    {Id: 2, Name: "Отсутствует"}
  ]
  StatusEqData: NewDropdown [] = [];

  statusRed: boolean = false
  getRedId: number;
  ngOnInit() {
    let Id
    let Name
    let Display
    let IsSelect
    for (let i = 0; i < this.pers.length; i++) {
      Id = this.pers[i].Id
      Name = this.pers[i].Fio
      Display = true
      IsSelect = false
      this.PersData.push(new NewDropdown(Id, Name, Display, IsSelect))
    }
    // console.log("PersData: ",this.PersData)
    for (let i = 0; i < this.equipment.length; i++) {
      Id = this.equipment[i].Id
      Name = this.equipment[i].FullName + " " + this.equipment[i].Number
      Display = true
      IsSelect = true
      this.EquipData.push(new NewDropdown(Id, Name, Display, IsSelect))
    }
    // console.log("EquipData: ",this.EquipData)
    for (let i = 0; i < this.location.length; i++) {
      Id = this.location[i].Id
      Name = this.location[i].SmallName
      Display = true
      IsSelect = true
      this.LocationData.push(new NewDropdown(Id, Name, Display, IsSelect))
    }
    // console.log("LocationData: ",this.LocationData)
    for (let i = 0; i < this.customer.length; i++) {
      Id = this.customer[i].Id
      Name = this.customer[i].SmallName
      Display = true
      IsSelect = true
      this.CustomerData.push(new NewDropdown(Id, Name, Display, IsSelect))
    }
    // console.log("CustomerData: ",this.CustomerData)
    for (let i = 0; i < this.status.length; i++) {
      Id = this.status[i].Id
      Name = this.status[i].DisplayName
      Display = true
      IsSelect = true
      this.StatusData.push(new NewDropdown(Id, Name, Display, IsSelect))
    }
    // console.log("StatusData: ",this.StatusData)
    for (let i = 0; i < this.Method.length; i++) {
      Id = this.Method[i].Id
      Name = this.Method[i].Name
      Display = true
      IsSelect = true
      this.MethodData.push(new NewDropdown(Id, Name, Display, IsSelect))
    }
    // console.log("MethodData: ",this.MethodData)
    for (let i = 0; i < this.StatusEq.length; i++) {
      Id = this.StatusEq[i].Id
      Name = this.StatusEq[i].Name
      Display = true
      IsSelect = true
      this.StatusEqData.push(new NewDropdown(Id, Name, Display, IsSelect))
    }
    // console.log("StatusEqData: ",this.StatusEqData)
    // if (localStorage.getItem('ReportIdData') !== null){

    // } else console.log("ReportIdData is null")
  }
  ngAfterViewInit(){
    if (localStorage.getItem('ReportIdData') !== null){
      setTimeout(() => {
      console.log("ReportIdData is not null!")
      this.statusRed = true
      let CwrWorksLoc = JSON.parse(localStorage.getItem('ReportIdData'))
      this.getRedId = CwrWorksLoc.Id
      console.log("CwrWorksLoc:", CwrWorksLoc)
      for (let i = 0; i < CwrWorksLoc.CwrWorks.length; i++) {
        this.Id = 0
        this.MethodControl = CwrWorksLoc.CwrWorks[i].MethodControl
        for (let j = 0; j < this.Method.length; j++) {
          if (this.Method[j].Name == CwrWorksLoc.CwrWorks[i].MethodControl){
            this.MethodControlId = this.Method[j].Id
          }
        }
        this.CustomerId = 1
        this.Shown = JSON.parse(CwrWorksLoc.CwrWorks[i].Shown)
        this.Made = JSON.parse(CwrWorksLoc.CwrWorks[i].Made)
        this.CwrId = 0

        for (let j = 0; j < CwrWorksLoc.CwrWorks[i].CwrWorkPersonals.length; j++) {
          this.CwrWorkPersonals[j] = {Id: 0, PersonalId: CwrWorksLoc.CwrWorks[i].CwrWorkPersonals[j].Personal.Id, Fio: CwrWorksLoc.CwrWorks[i].CwrWorkPersonals[j].Personal.Fio, CwrWorkId: 0}
        }

        for (let j = 0; j < CwrWorksLoc.CwrWorks[i].CwrWorkEquipments.length; j++) {
          this.CwrWorkEquipments[j] = {Id: 0, EquipmentId: CwrWorksLoc.CwrWorks[i].CwrWorkEquipments[j].Equipment.Id, Name: CwrWorksLoc.CwrWorks[i].CwrWorkEquipments[j].Equipment.FullName + " " + CwrWorksLoc.CwrWorks[i].CwrWorkEquipments[j].Equipment.Number, CwrWorkId: 0}
        }

        this.Customer = CwrWorksLoc.CwrWorks[i].Customer.SmallName
        this.PersonalName = ""
        this.EquipmentName = ""
        this.Comment = CwrWorksLoc.CwrWorks[i].Comment
        this.reportsCards.push(new CwrWorks(this.Id, this.MethodControl,this.MethodControlId,this.CustomerId, this.Shown, this.Made, this.CwrId, this.CwrWorkPersonals, this.CwrWorkEquipments, this.Customer, this.PersonalName, this.EquipmentName, this.Comment))
        console.log("this.reportsCards", this.reportsCards)

      }
      for (let i = 0; i < CwrWorksLoc.CwrPersonals.length; i++) {
        this.PersonalId = CwrWorksLoc.CwrPersonals[i].Personal.Id
        this.PersonalStatusName = CwrWorksLoc.CwrPersonals[i].Personal.Fio
        for (let j = 0; j < CwrWorksLoc.CwrPersonals[i].CwrStatusFromPersonals.length; j++) {
          this.CwrStatusFromPersonals = [{ Id: 0, CwrStatusId: CwrWorksLoc.CwrPersonals[i].CwrStatusFromPersonals[j].CwrPesonalStatus.Id, CwrPersonalId: 0, DisplayName: CwrWorksLoc.CwrPersonals[i].CwrStatusFromPersonals[j].CwrPesonalStatus.DisplayName}]
        }

        this.reportsPers.push(new CwrPersonals(this.Id, this.PersonalId, this.CwrId, this.Personal, this.CwrStatusFromPersonals, this.PersonalStatus, this.PersonalStatusName))
      }
      for (let i = 0; i < CwrWorksLoc.CwrEquipments.length; i++) {
        this.CwrEquipments = CwrWorksLoc.CwrEquipments[i].Equipment.FullName + " " + CwrWorksLoc.CwrEquipments[i].Equipment.Number
        this.EquipmentId = CwrWorksLoc.CwrEquipments[i].Equipment.Id
        this.Status = "Исправен"
        this.StatusId = 0
        for (let j = 0; j < this.StatusEq.length; j++) {
          if (this.StatusEq[j].Name == CwrWorksLoc.CwrEquipments[i].status){
            this.StatusId = this.StatusEq[j].Id
          }
        }

        this.reportEquip.push(new CwrEquipments(this.Id, this.EquipmentId, this.Status, this.StatusId, this.CwrId, this.CwrEquipments))
      }

      this.ChiefCtrl.setValue(CwrWorksLoc.СhiefUserId)
      this.LocationCtrl.setValue(CwrWorksLoc.SubLocationId)
      this.DataReportCtrl.setValue(CwrWorksLoc.DataReport)
      console.log("DataReportCtrl: ", this.DataReportCtrl)

      localStorage.removeItem('ReportIdData')

      this.dropdownSelect.dropCH(this.PersData, this.ChiefCtrl.value, this.ChiefCtrl)
      this.dropdownSelect.dropCH(this.LocationData, this.LocationCtrl.value, this.LocationCtrl)
    }, 0)
    } else console.log("ReportIdData is null")

  }

  constructor(private rep: ReportAdd,  private router: Router, private repRed: ReportRed) { }

  MethodControl: string = ""
  MethodControlId: number = 0
  MethodAdd($event){
    console.log("$event MethodName: ", $event)
    console.log("$event MethodName: ", $event.valueName)
    this.MethodControl = ""
    this.MethodControl = $event.valueName
    this.MethodControlId = 0
    this.MethodControlId =  $event.valueId
    console.log("MethodName: ", this.MethodControl)
  }
  CustomerId: number = 0;
  Customer: string = ""
  CustomerAdd($event){
    console.log("$event CustomerId: ", $event)
    console.log("$event CustomerId: ", $event.valueId)
    this.CustomerId = 0
    this.CustomerId = $event.valueId
    this.Customer = ""
    this.Customer = $event.valueName
    console.log("CustomerId: ", this.CustomerId)
  }
  CwrWorkPersonalsItem = []
  CwrWorkPersonalsItemFio = []
  CwrWorkPersonalsAdd($event){
    console.log("$event CwrWorkPersonalsItem: ", $event)
    this.CwrWorkPersonalsItem = []
    this.CwrWorkPersonalsItemFio = []

    for (let i = 0; i < $event.valueId.length; i++) {
      this.CwrWorkPersonalsItem.push($event.valueId[i])
      this.CwrWorkPersonalsItemFio.push($event.valueName[i])
    }
    console.log("CwrWorkPersonalsItem: ", this.CwrWorkPersonalsItem )
    console.log("CwrWorkPersonalsItemFio: ", this.CwrWorkPersonalsItemFio )
    // this.CwrWorkPersonals = this.CwrWorkPersonals.PersonalId.concat($event.value)

  }
  CwrWorkEquipmentsItem = []
  CwrWorkEquipmentsItemFullNameNumber = []
  CwrWorkEquipmentsAdd($event){
    console.log("$event CwrWorkEquipmentsItem: ", $event)
    this.CwrWorkEquipmentsItem = []
    this.CwrWorkEquipmentsItemFullNameNumber = []

    for (let i = 0; i < $event.valueId.length; i++) {
      this.CwrWorkEquipmentsItem.push($event.valueId[i])
      this.CwrWorkEquipmentsItemFullNameNumber.push($event.valueName[i])
    }
    console.log("CwrWorkEquipmentsItem: ", this.CwrWorkEquipmentsItem )
    console.log("CwrWorkEquipmentsItemFullNameNumber: ", this.CwrWorkEquipmentsItemFullNameNumber )
    // this.CwrWorkPersonals = this.CwrWorkPersonals.PersonalId.concat($event.value)

  }

  Id: number = 0;
  // MethodControl: string = "";
  Shown: number = 0;
  Made: number = 0;
  CwrId: number = 0;
  CwrWorkPersonals : any = [{Id: 0, PersonalId: 0, Fio: "", CwrWorkId: 0}]
  CwrWorkEquipments : any = [{Id: 0, EquipmentId: 0, Name: "", CwrWorkId: 0}]

  PersonalName: string
  EquipmentName: string = "";

  Comment?: string = "";

  reportsCards: CwrWorks[] = [];

  // form1: FormGroup
  MethodControlCtrl: FormControl = new FormControl('', Validators.required);
  CustomerCtrl: FormControl = new FormControl('', Validators.required);
  CwrWorkPersonalsCtrl: FormControl = new FormControl('', Validators.required)
  CwrWorkEquipmentsCtrl: FormControl = new FormControl('', Validators.required)
  ShownCtrl: FormControl = new FormControl('', Validators.required)
  MadeCtrl: FormControl = new FormControl('', Validators.required)
  CommentCtrl: FormControl = new FormControl('')
  addOnPopup(){

    console.log("MethodControl test:", this.MethodControl)
    console.log("CustomerId test:", this.CustomerId)
    console.log("Customer test:", this.Customer)
    for (let i = 0; i < this.CwrWorkPersonalsItem.length; i++) {
      this.CwrWorkPersonals[i] = {Id: 0, PersonalId: this.CwrWorkPersonalsItem[i], Fio: this.CwrWorkPersonalsItemFio[i], CwrWorkId: 0}
    }
    console.log("CwrWorkPersonals: ", this.CwrWorkPersonals)
    for (let i = 0; i < this.CwrWorkEquipmentsItem.length; i++) {
      this.CwrWorkEquipments[i] = {Id: 0, EquipmentId: this.CwrWorkEquipmentsItem[i], Name: this.CwrWorkEquipmentsItemFullNameNumber[i], CwrWorkId: 0}
    }

    this.Shown = this.ShownCtrl.value
    this.Made = this.MadeCtrl.value
    this.Comment = this.CommentCtrl.value

    this.reportsCards.push(new CwrWorks(this.Id, this.MethodControl,this.MethodControlId,this.CustomerId, this.Shown, this.Made, this.CwrId, this.CwrWorkPersonals, this.CwrWorkEquipments, this.Customer, this.PersonalName, this.EquipmentName, this.Comment))
    console.log("this.reportsCards:", this.reportsCards)

    for (let i = 0; i < this.CwrWorkPersonalsItem.length; i++) {
      this.PersonalId = this.CwrWorkPersonalsItem[i]
      this.PersonalStatusName = this.CwrWorkPersonalsItemFio[i]
      this.CwrStatusFromPersonals = [{ Id: 0, CwrStatusId: 4, CwrPersonalId: 0, DisplayName: "Проведение контроля"}]
      console.log("CwrStatusFromPersonals", this.CwrStatusFromPersonals )
      this.reportsPers.push(new CwrPersonals(this.Id, this.PersonalId, this.CwrId, this.Personal, this.CwrStatusFromPersonals, this.PersonalStatus, this.PersonalStatusName))
      console.log("this.reportsPers:", this.reportsPers)
    }
    for (let i = 0; i < this.CwrWorkEquipmentsItem.length; i++) {
      this.CwrEquipments = this.CwrWorkEquipmentsItemFullNameNumber[i]
      this.EquipmentId = this.CwrWorkEquipmentsItem[i]
      this.Status = "Исправен"
      this.StatusId = 0
      this.reportEquip.push(new CwrEquipments(this.Id, this.EquipmentId, this.Status, this.StatusId, this.CwrId, this.CwrEquipments))
      console.log("reportEquip: ",this.reportEquip)
    }



    this.CwrWorkPersonals = [{Id: 0, PersonalId: 0, Fio: "", CwrWorkId: 0}]
    this.CwrWorkEquipments = [{Id: 0, EquipmentId: 0, Name: "", CwrWorkId: 0}]
    this.popupOpen()
    this.MethodControlCtrl = new FormControl('', Validators.required);
    this.CustomerCtrl = new FormControl('', Validators.required);
    this.CwrWorkPersonalsCtrl = new FormControl('', Validators.required);
    this.CwrWorkEquipmentsCtrl = new FormControl('', Validators.required);
    this.ShownCtrl = new FormControl('', Validators.required);
    this.MadeCtrl = new FormControl('', Validators.required);
    this.CommentCtrl = new FormControl('');
  }

  PersonalAddId: number
  PersonalAddName: string
  PersonalAdd($event){
    console.log("$event PersonalAddId: ", $event.valueId)
    console.log("$event PersonalAddName: ", $event.valueName)
    this.PersonalAddName = ""
    this.PersonalAddName = $event.valueName
    this.PersonalAddId = 0
    this.PersonalAddId = $event.valueId
    console.log("PersonalAddName: ", this.PersonalAddName)
  }
  StatusItem = []
  StatusItemDisplayName = []
  StatusAdd($event){
    console.log("$event CwrWorkPersonalsItem: ", $event)
    this.StatusItem = []
    this.StatusItemDisplayName = []

    for (let i = 0; i < $event.valueId.length; i++) {
      this.StatusItem.push($event.valueId[i])
      this.StatusItemDisplayName.push($event.valueName[i])
    }
    console.log("StatusItem: ", this.StatusItem )
    console.log("StatusItemDisplayName: ", this.StatusItemDisplayName )
    // this.CwrWorkPersonals = this.CwrWorkPersonals.PersonalId.concat($event.value)

  }
  Personal: string = "";
  PersonalStatus: string = "";
  PersonalId = 0
  CwrStatusFromPersonals: any = [{ Id: 0, CwrStatusId: 0, CwrPersonalId: 0, DisplayName: ""}]
  Comment2?: string = "";

  PersonalStatusName: string = "";
  reportsPers: CwrPersonals [] = []
  // form2: FormGroup
  CwrPersonalCtrl: FormControl = new FormControl('', Validators.required);
  StatusCtrl: FormControl = new FormControl('', Validators.required);
  CommentCtrl2: FormControl = new FormControl('');
  addOnPopup2(){
    for (let i = 0; i < this.StatusItem.length; i++) {
      this.CwrStatusFromPersonals[i] = { Id: 0, CwrStatusId: this.StatusItem[i], CwrPersonalId: 0, DisplayName: this.StatusItemDisplayName[i]}
    }
    console.log("CwrStatusFromPersonals", this.CwrStatusFromPersonals )

    this.PersonalStatusName = this.PersonalAddName
    this.PersonalId = this.PersonalAddId
    this.Comment2 = this.CommentCtrl2.value

    this.reportsPers.push(new CwrPersonals(this.Id, this.PersonalId, this.CwrId, this.Personal, this.CwrStatusFromPersonals, this.PersonalStatus, this.PersonalStatusName, this.Comment2))
    console.log("this.reportsPers:", this.reportsPers)

    this.popupOpen2();
    this.CwrPersonalCtrl = new FormControl('', Validators.required);
    this.StatusCtrl = new FormControl('', Validators.required);
    this.CommentCtrl2 = new FormControl('');

  }

  EquipmentsItem: number = 0
  EquipmentsItemFullNameNumber: string = ""
  EquipmentAdd($event){
    console.log("$event EquipmentsItem: ", $event.valueId)
    console.log("$event EquipmentsItemFullNameNumber: ", $event.valueName)
    this.EquipmentsItemFullNameNumber = ""
    this.EquipmentsItemFullNameNumber = $event.valueName
    this.EquipmentsItem = 0
    this.EquipmentsItem = $event.valueId
    console.log("EquipmentsItemFullNameNumber: ", this.EquipmentsItemFullNameNumber)
  }

  StatusEqAdd($event){
    console.log("$event StatusEqAdd: ", $event)
    console.log("$event StatusEqAdd: ", $event.valueName)
    this.Status = ""
    this.Status = $event.valueName
    this.StatusId = $event.ValueId
    console.log("Status: ", this.Status)
  }
  CwrEquipments: string = "";
  Status: string = "";
  StatusId: number = 0;
  EquipmentId: number = 0;
  reportEquip: CwrEquipments [] = []
  Comment3?: string = "";

  CwrEquipmentslCtrl: FormControl = new FormControl('', Validators.required);
  StatusEqCtrl: FormControl = new FormControl('', Validators.required);
  CommentCtrl3: FormControl = new FormControl('');
  addOnPopup3(){
    this.CwrEquipments = this.EquipmentsItemFullNameNumber
    this.EquipmentId = this.EquipmentsItem
    this.Comment3 = this.CommentCtrl3.value
    // this.Status = ""
    this.reportEquip.push(new CwrEquipments(this.Id, this.EquipmentId, this.Status, this.StatusId, this.CwrId, this.CwrEquipments, this.Comment3))
    console.log("reportEquip: ",this.reportEquip)
    this.popupOpen3();
  }

  // formSub: FormGroup;
  aSub: Subscription;

  UserId = localStorage.getItem('Id')
  repAdd: any

  СhiefId: number = 0
  ChiefIdAdd($event){
    console.log("$event СhiefIdAdd: ", $event)
    this.СhiefId = 0
    this.СhiefId = $event.valueId
    console.log("СhiefIdAdd: ", this.СhiefId)
  }
  locationId: number = 0
  LocationIdAdd($event){
    console.log("$event locationId: ", $event)
    this.locationId = 0
    this.locationId = $event.valueId
    console.log("locationId: ", this.locationId)
  }
  LocationCtrl: FormControl = new FormControl('', Validators.required);
  ChiefCtrl: FormControl = new FormControl('', Validators.required);
  DataReportCtrl: FormControl = new FormControl('', Validators.required);

  fileToUpload: File | null = null;
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}
  reportSubmit() {
    console.log("locationId: ", this.locationId) //получение locationId в консоль
    console.log("СhiefIdAdd: ", this.СhiefId) //получение СhiefIdAdd в консоль
    console.log(this.DataReportCtrl.value) //получение DataReport в консоль


    for (let i = 0; i < this.reportsCards.length; i++) {
      this.reportsCards[i].Customer = null;
    }

    // this.reportsPers[0].Personal = null;
    // this.reportsPers[0].PersonalStatus = null;
    const newrep = {
      Id: 0,
      DataCreate: "2021-09-28T15:19:27.9123256+05:00",
      UserId: JSON.parse(localStorage.getItem("Id")),
      СhiefUserId: this.СhiefId,
      GeneralLocationId: 1,
      SubLocationId: this.locationId,
      DataReport: this.DataReportCtrl.value,
      Comment: "",
      IsActual: true,
      GeneralLocation: null,
      CwrWorks: this.reportsCards,
      CwrPersonals: this.reportsPers,
      CwrEquipments: this.reportEquip,
      CwrActions: null,
      CwrFiles: null
    }
    console.log("newrep: ", newrep)
    this.repAdd = newrep;
    if (this.statusRed == false){
      this.aSub = this.rep.reportAdd(this.repAdd).subscribe(
        (pers)=>{
          console.log('Отчет отправлен!', pers)
          this.router.navigate(['/reports/list'])
        },
        error => console.log('Ошибка отправки формы отчета: ')
      )
    } else {
      this.aSub = this.repRed.reportRed(this.repAdd, this.getRedId).subscribe(
        (repRed) => {
          console.log("Отчет отредактирован! ", repRed)
        },
        error => console.log("Ошибка! отчет не отправлен")
      )
    }
  }

  ngOnDestroy(){
    if (this.aSub){
      this.aSub.unsubscribe()
    }
  }
  @ViewChild(DropdownSelectComponent ) dropdownSelect: DropdownSelectComponent;
  @ViewChild(DropdownMultiComponent ) dropdownMulti: DropdownMultiComponent;
  @ViewChild(DropdownMultiCloneComponent ) dropdownMultiClone: DropdownMultiCloneComponent;

  CwrWorksRedItemi = 0
  CwrWorksRed(i){
    this.popOpenRed = !this.popOpenRed
    this.CwrWorksRedItemi = i

    // console.log("this.reportsCards[this.CwrWorksRedItemi]: ", this.reportsCards[this.CwrWorksRedItemi])
    this.MethodControlCtrl.setValue(this.reportsCards[this.CwrWorksRedItemi].MethodControlId)
    this.dropdownSelect.dropCH(this.MethodData, this.MethodControlCtrl.value, this.MethodControlCtrl)

    this.CustomerCtrl.setValue(this.reportsCards[this.CwrWorksRedItemi].CustomerId)
    this.dropdownSelect.dropCH(this.CustomerData, this.CustomerCtrl.value, this.CustomerCtrl)

    // console.log("(this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals",this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals)

    let countPers: number []=[]
    for (let j = 0; j < this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals.length; j++) {
      countPers.push(this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals[j].PersonalId)
    }
    this.dropdownMulti.dropCH(this.PersData, countPers, this.CwrWorkPersonalsCtrl)

    let countEquip = []
    for (let j = 0; j < this.reportsCards[this.CwrWorksRedItemi].CwrWorkEquipments.length; j++) {
      countEquip.push(this.reportsCards[this.CwrWorksRedItemi].CwrWorkEquipments[j].EquipmentId)
    }
    this.dropdownMulti.dropCH(this.EquipData, countEquip, this.CwrWorkEquipmentsCtrl)

    this.ShownCtrl.setValue(this.reportsCards[this.CwrWorksRedItemi].Shown)
    this.MadeCtrl.setValue(this.reportsCards[this.CwrWorksRedItemi].Made)
    this.CommentCtrl.setValue(this.reportsCards[this.CwrWorksRedItemi].Comment)

    console.log("i: ", i)
  }
  RedOnPopup(){
    //добавление в CwrWorks
    console.log("i: ", this.CwrWorksRedItemi)
    this.reportsCards[this.CwrWorksRedItemi].MethodControl = this.MethodControl
    this.reportsCards[this.CwrWorksRedItemi].MethodControlId = this.MethodControlId
    this.reportsCards[this.CwrWorksRedItemi].CustomerId = this.CustomerId
    this.reportsCards[this.CwrWorksRedItemi].Customer = this.Customer
    // this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals = [{Id: 0, PersonalId: 0, Fio: "", CwrWorkId: 0}]
    for (let j = 0; j < this.CwrWorkPersonalsItem.length; j++) {
      this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals[j] = {Id: 0, PersonalId: 0, Fio: "", CwrWorkId: 0}
      this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals[j] = {Id: 0, PersonalId: this.CwrWorkPersonalsItem[j], Fio: this.CwrWorkPersonalsItemFio[j], CwrWorkId: 0}
    }
    // this.reportsCards[this.CwrWorksRedItemi].CwrWorkEquipments = [{Id: 0, EquipmentId: 0, Name: "", CwrWorkId: 0}]
    for (let j = 0; j < this.CwrWorkEquipmentsItem.length; j++) {
      this.reportsCards[this.CwrWorksRedItemi].CwrWorkEquipments[j] = {Id: 0, EquipmentId: 0, Name: "", CwrWorkId: 0}
      this.reportsCards[this.CwrWorksRedItemi].CwrWorkEquipments[j] = {Id: 0, EquipmentId: this.CwrWorkEquipmentsItem[j], Name: this.CwrWorkEquipmentsItemFullNameNumber[j], CwrWorkId: 0}
    }
    this.reportsCards[this.CwrWorksRedItemi].Shown = this.ShownCtrl.value
    this.reportsCards[this.CwrWorksRedItemi].Made = this.MadeCtrl.value
    this.reportsCards[this.CwrWorksRedItemi].Comment = this.CommentCtrl.value

    //добавление в CwrWorkPersonals
    for (let i = 0; i < this.CwrWorkPersonalsItem.length; i++) {
      this.PersonalId = this.CwrWorkPersonalsItem[i]
      this.PersonalStatusName = this.CwrWorkPersonalsItemFio[i]
      this.CwrStatusFromPersonals = [{ Id: 0, CwrStatusId: 4, CwrPersonalId: 0, DisplayName: "Проведение контроля"}]
      console.log("CwrStatusFromPersonals", this.CwrStatusFromPersonals )
      this.reportsPers.push(new CwrPersonals(this.Id, this.PersonalId, this.CwrId, this.Personal, this.CwrStatusFromPersonals, this.PersonalStatus, this.PersonalStatusName))
      console.log("this.reportsPers:", this.reportsPers)
    }
    //добавление в CwrWorkEquipments
    for (let i = 0; i < this.CwrWorkEquipmentsItem.length; i++) {
      this.CwrEquipments = this.CwrWorkEquipmentsItemFullNameNumber[i]
      this.EquipmentId = this.CwrWorkEquipmentsItem[i]
      this.Status = "Исправен"
      this.StatusId = 0
      this.reportEquip.push(new CwrEquipments(this.Id, this.EquipmentId, this.Status, this.StatusId, this.CwrId, this.CwrEquipments))
      console.log("reportEquip: ",this.reportEquip)
    }


    // this.reportsCards.push(new CwrWorks(this.Id, this.MethodControl,this.CustomerId, this.Shown, this.Made, this.CwrId, this.CwrWorkPersonals, this.CwrWorkEquipments, this.Customer, this.PersonalName, this.EquipmentName))
    console.log("this.reportsCards:", this.reportsCards[this.CwrWorksRedItemi])
    this.popupOpenRed()
    // this.CwrWorkPersonals = [{Id: 0, PersonalId: 0, Fio: "", CwrWorkId: 0}]
    // this.CwrWorkEquipments = [{Id: 0, EquipmentId: 0, Name: "", CwrWorkId: 0}]
    this.MethodControlCtrl = new FormControl('', Validators.required);
    this.CustomerCtrl = new FormControl('', Validators.required);
    this.CwrWorkPersonalsCtrl = new FormControl('', Validators.required);
    this.CwrWorkEquipmentsCtrl = new FormControl('', Validators.required);
    this.ShownCtrl = new FormControl('', Validators.required);
    this.MadeCtrl = new FormControl('', Validators.required);
    this.CommentCtrl = new FormControl('');

  }

  CwrPersonalsRedItemi = 0
  CwrPersonalsRed(i){
    this.popOpenRed2 = !this.popOpenRed2
    this.CwrPersonalsRedItemi = i

    this.CwrPersonalCtrl.setValue(this.reportsPers[this.CwrPersonalsRedItemi].PersonalId)
    this.dropdownSelect.dropCH(this.PersData, this.CwrPersonalCtrl.value, this.CwrPersonalCtrl)

    let countStatus: number []=[]
    for (let j = 0; j < this.reportsPers[this.CwrPersonalsRedItemi].CwrStatusFromPersonals.length; j++) {
      countStatus.push(this.reportsPers[this.CwrPersonalsRedItemi].CwrStatusFromPersonals[j].CwrStatusId)
    }
    this.dropdownMulti.dropCH(this.StatusData, countStatus, this.StatusCtrl)

    this.CommentCtrl2.setValue(this.reportsPers[this.CwrPersonalsRedItemi].Comment)
    console.log("i: ", i)
  }
  RedOnPopup2(){
    console.log("i: ", this.CwrPersonalsRedItemi)
    // this.reportsPers[this.CwrPersonalsRedItemi].CwrStatusFromPersonals = [{Id: 0, CwrStatusId: 0, CwrPersonalId: 0, DisplayName: ""}]
    for (let j = 0; j < this.StatusItem.length; j++) {
      // this.reportsPers[this.CwrPersonalsRedItemi].CwrStatusFromPersonals[j] = {Id: 0, CwrStatusId: 0, CwrPersonalId: 0, DisplayName: ""}
      this.reportsPers[this.CwrPersonalsRedItemi].CwrStatusFromPersonals[j] = {Id: 0, CwrStatusId: this.StatusItem[j], CwrPersonalId: 0, DisplayName: this.StatusItemDisplayName[j]}
    }
    console.log("PersonalAddName: ", this.PersonalAddName)
    console.log("CwrPersonalCtrl: ",this.CwrPersonalCtrl.value)
    this.reportsPers[this.CwrPersonalsRedItemi].PersonalStatusName = this.CwrPersonalCtrl.value.Name
    this.reportsPers[this.CwrPersonalsRedItemi].PersonalId = this.PersonalAddId
    this.reportsPers[this.CwrPersonalsRedItemi].Comment = this.CommentCtrl2.value

    this.popupOpenRed2()
    this.CwrPersonalCtrl = new FormControl('', Validators.required);
    this.StatusCtrl = new FormControl('', Validators.required);
    this.CommentCtrl2 = new FormControl('');
  }

  CwrEquipmentsRedItemi = 0
  CwrEquipmentsRed(i){
    this.popOpenRed3 = !this.popOpenRed3
    this.CwrEquipmentsRedItemi = i

    this.CwrEquipmentslCtrl.setValue(this.reportEquip[this.CwrEquipmentsRedItemi].EquipmentId)
    this.dropdownSelect.dropCH(this.EquipData, this.CwrEquipmentslCtrl.value, this.CwrEquipmentslCtrl)

    this.StatusEqCtrl.setValue(this.reportEquip[this.CwrEquipmentsRedItemi].StatusId)
    this.dropdownSelect.dropCH(this.StatusEqData, this.StatusEqCtrl.value, this.StatusEqCtrl)

    this.CommentCtrl3.setValue(this.reportEquip[this.CwrEquipmentsRedItemi].Comment)

    this.CwrEquipmentsRedItemi = i
    console.log("i: ", i)
  }
  RedOnPopup3(){
    console.log("i: ", this.CwrEquipmentsRedItemi)
    console.log("CwrEquipmentslCtrl: ", this.CwrEquipmentslCtrl.value)
    this.reportEquip[this.CwrEquipmentsRedItemi].CwrEquipments = this.CwrEquipmentslCtrl.value.Name
    // this.EquipmentsItemFullNameNumber
    this.reportEquip[this.CwrEquipmentsRedItemi].EquipmentId = this.EquipmentsItem
    this.reportEquip[this.CwrEquipmentsRedItemi].Status = this.Status
    this.reportEquip[this.CwrEquipmentsRedItemi].Comment = this.CommentCtrl3.value
    this.popupOpenRed3()
    this.CwrEquipmentslCtrl = new FormControl('', Validators.required);
    this.StatusEqCtrl = new FormControl('', Validators.required);
    this.CommentCtrl3 = new FormControl('');
  }


  tabsBg = true;
  tabsBg2 = false;
  tabsBg3 = false;

  popOpen = false;
  popOpen2 = false;
  popOpen3 = false;

  popOpenRed = false;
  popOpenRed2 = false;
  popOpenRed3 = false;


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

  popupOpenRed(){
    this.popOpenRed = !this.popOpenRed
    this.MethodControlCtrl = new FormControl('', Validators.required);
    this.CustomerCtrl = new FormControl('', Validators.required);
    this.CwrWorkPersonalsCtrl = new FormControl('', Validators.required);
    this.CwrWorkEquipmentsCtrl = new FormControl('', Validators.required);
    this.ShownCtrl = new FormControl('', Validators.required);
    this.MadeCtrl = new FormControl('', Validators.required);
    this.CommentCtrl = new FormControl('');
  }
  popupOpenRed2(){
    this.popOpenRed2 = !this.popOpenRed2
    this.CwrPersonalCtrl = new FormControl('', Validators.required);
    this.StatusCtrl = new FormControl('', Validators.required);
    this.CommentCtrl2 = new FormControl('');
  }
  popupOpenRed3(){
    this.popOpenRed3 = !this.popOpenRed3
    this.CwrEquipmentslCtrl = new FormControl('', Validators.required);
    this.StatusEqCtrl = new FormControl('', Validators.required);
    this.CommentCtrl3 = new FormControl('');
  }

}
