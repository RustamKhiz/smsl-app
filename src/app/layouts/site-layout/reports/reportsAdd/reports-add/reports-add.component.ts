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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Byte } from '@angular/compiler/src/util';



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
export class CwrFiles {
  constructor(public Id: number,
              public OriginalName: string,
              public FullPath: string,
              public DisplayName: string,
              public Length: number,
              public FileType: string,
              public Ext: string,
              public IsPreveiw: boolean,
              public CwrId: number,
              public Bytes,
              public Hash: string

  ) {}
}
@Component({
  selector: 'app-reports-add',
  templateUrl: './reports-add.component.html',
  styleUrls: ['./reports-add.component.css']
})
export class ReportsAddComponent implements OnInit, AfterViewInit, OnDestroy {
  //получение данных для отчетов
  pers = JSON.parse(localStorage.getItem('Personal'));
  PersData: NewDropdown [] = []; //инициализация общего интервейса
  equipment = JSON.parse(localStorage.getItem('Mashines'))
  EquipData: NewDropdown [] = []; //инициализация общего интервейса
  location = JSON.parse(localStorage.getItem('Locations'))
  LocationData: NewDropdown [] = []; //инициализация общего интервейса
  customer = JSON.parse(localStorage.getItem('Customers'))
  CustomerData: NewDropdown [] = []; //инициализация общего интервейса
  status = JSON.parse(localStorage.getItem('PesonalStatuses'))
  StatusData: NewDropdown [] = []; //инициализация общего интервейса
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
  MethodData: NewDropdown [] = []; //инициализация общего интервейса
  StatusEq = [
    {Id: 0, Name: "Исправен"},
    {Id: 1, Name: "Не исправен"},
    {Id: 2, Name: "Отсутствует"}
  ]
  StatusEqData: NewDropdown [] = []; //инициализация общего интервейса
  ChiefData: NewDropdown [] = [];
  //конец получения данных для отчетов

  statusRed: boolean = false //переменная для определения статуса редактирования (добавление или редактирование отчета)
  getRedId: number; //переменная для номера сформированного отчета
  ngOnInit() {
    // начало заполнения интерфейса NewDropdown для всех необходимых данных
      let Id
      let Name
      let Display
      let IsSelect
      for (let i = 0; i < this.pers.length; i++) {
        if (this.pers[i].StatusWork !== "Уволен"){
          Id = this.pers[i].Id
          Name = this.pers[i].Name + " " + this.pers[i].LastName
          Display = true
          IsSelect = false
          this.PersData.push(new NewDropdown(Id, Name, Display, IsSelect))
        }
      }
      // console.log("PersData: ",this.PersData)
      for (let i = 0; i < this.equipment.length; i++) {
        Id = this.equipment[i].Id

        Name =  this.equipment[i].Name + " " + this.equipment[i].Number // this.equipment[i].FullName + " " +
        Display = true
        IsSelect = true
        this.EquipData.push(new NewDropdown(Id, Name, Display, IsSelect))
      }
      // console.log("EquipData: ",this.EquipData)
      for (let i = 0; i < this.location.length; i++) {
        if (this.location[i].Actual == 1){
          Id = this.location[i].Id
          Name = this.location[i].SmallName
          Display = true
          IsSelect = true
          this.LocationData.push(new NewDropdown(Id, Name, Display, IsSelect))
        }
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
      for (let i = 0; i < this.pers.length; i++) {
        if (this.pers[i].StatusWork !== "Уволен"){
          Id = this.pers[i].Id
          Name = this.pers[i].Name + " " + this.pers[i].LastName
          Display = true
          IsSelect = false
          // let ChiefObj = this.pers.find(x => x.Id == report.SubLocationId)
          this.ChiefData.push(new NewDropdown(Id, Name, Display, IsSelect))
        }

      }
    // Конец заполнения интерфейса NewDropdown для всех необходимых данных

    // Заполнение отчета, если зашли в режим редактирования сформированного отчета
    if (localStorage.getItem('ReportIdData') !== null){
      setTimeout(() => { //setTimeout 0 для корректного добавления данных  в режим редактирования сформированного отчета, костыль
      console.log("ReportIdData is not null!")

      this.statusRed = true //меняем статус редактирования на true

      let CwrWorksLoc = JSON.parse(localStorage.getItem('ReportIdData')) //получаем данные сформированного отчета
      this.getRedId = CwrWorksLoc.Id //получаем номер сформированного отчета

      console.log("CwrWorksLoc:", CwrWorksLoc)

      //начало присвоения данных для режима редактирования
      for (let i = 0; i < CwrWorksLoc.CwrWorks.length; i++) {
        this.Id = CwrWorksLoc.Id
        this.MethodControl = CwrWorksLoc.CwrWorks[i].MethodControl
        for (let j = 0; j < this.Method.length; j++) {
          if (this.Method[j].Name == CwrWorksLoc.CwrWorks[i].MethodControl){
            this.MethodControlId = this.Method[j].Id
          }
        }
        this.CustomerId = CwrWorksLoc.CwrWorks[i].CustomerId
        this.Shown = JSON.parse(CwrWorksLoc.CwrWorks[i].Shown)
        this.Made = JSON.parse(CwrWorksLoc.CwrWorks[i].Made)
        this.CwrId = this.getRedId
        // this.CwrWorkPersonals = {Id: 0, PersonalId: 0, Fio: "", CwrWorkId: 0}

        for (let j = 0; j < CwrWorksLoc.CwrWorks[i].CwrWorkPersonals.length; j++) {
          this.CwrWorkPersonals[j] = {Id: 0, PersonalId: CwrWorksLoc.CwrWorks[i].CwrWorkPersonals[j].Personal.Id, Fio: CwrWorksLoc.CwrWorks[i].CwrWorkPersonals[j].Personal.SmalFio, CwrWorkId: 0}
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

        this.CwrWorkPersonals = [] //ОЧЕНЬ ВАЖНОЕ ОБНУЛЕНИЕ
        this.CwrWorkEquipments = [] //ОЧЕНЬ ВАЖНОЕ ОБНУЛЕНИЕ
      }

      for (let i = 0; i < CwrWorksLoc.CwrPersonals.length; i++) {
        this.Id = CwrWorksLoc.CwrPersonals[i].Id
        this.CwrId = this.getRedId
        this.PersonalId = CwrWorksLoc.CwrPersonals[i].Personal.Id
        this.PersonalStatusName = CwrWorksLoc.CwrPersonals[i].Personal.Fio
        for (let j = 0; j < CwrWorksLoc.CwrPersonals[i].CwrStatusFromPersonals.length; j++) {
          this.CwrStatusFromPersonals[j] = { Id: 0, CwrStatusId: CwrWorksLoc.CwrPersonals[i].CwrStatusFromPersonals[j].CwrPesonalStatus.Id, CwrPersonalId: 0, DisplayName: CwrWorksLoc.CwrPersonals[i].CwrStatusFromPersonals[j].CwrPesonalStatus.DisplayName}
        }
        this.Comment2 = CwrWorksLoc.CwrPersonals[i].Comment
        this.reportsPers.push(new CwrPersonals(this.Id, this.PersonalId, this.CwrId, this.Personal, this.CwrStatusFromPersonals, this.PersonalStatus, this.PersonalStatusName, this.Comment2))
        this.CwrStatusFromPersonals = []
      }
      for (let i = 0; i < CwrWorksLoc.CwrEquipments.length; i++) {
        this.Id = CwrWorksLoc.CwrEquipments[i].Id
        this.CwrEquipments = CwrWorksLoc.CwrEquipments[i].Equipment.FullName + " " + CwrWorksLoc.CwrEquipments[i].Equipment.Number
        this.EquipmentId = CwrWorksLoc.CwrEquipments[i].Equipment.Id
        this.Status = CwrWorksLoc.CwrEquipments[i].Status
        this.StatusId = 0
        this.Comment3 = CwrWorksLoc.CwrEquipments[i].Comment
        this.CwrId = this.getRedId
        for (let j = 0; j < this.StatusEq.length; j++) {
          if (this.StatusEq[j].Name == CwrWorksLoc.CwrEquipments[i].status){
            this.StatusId = this.StatusEq[j].Id
          }
        }

        this.reportEquip.push(new CwrEquipments(this.Id, this.EquipmentId, this.Status, this.StatusId, this.CwrId, this.CwrEquipments, this.Comment3))
      }
      for (let i = 0; i < CwrWorksLoc.CwrFiles.length; i++) {
        this.Id = CwrWorksLoc.CwrFiles[i].Id
        this.OriginalName = CwrWorksLoc.CwrFiles[i].OriginalName
        this.DisplayName = CwrWorksLoc.CwrFiles[i].OriginalName
        this.CwrId = CwrWorksLoc.CwrFiles[i].CwrId
        this.reportFile.push(new CwrFiles(this.Id, this.OriginalName, this.FullPath, this.DisplayName, this.Length, this.FileType, this.Ext, this.IsPreveiw, this.CwrId, this.Bytes, this.Hash) )
      }

      this.ChiefCtrl.setValue(CwrWorksLoc.СhiefUserId)
      this.LocationCtrl.setValue(CwrWorksLoc.SubLocationId)
      this.DataReportCtrl.setValue(CwrWorksLoc.DataReport)
      console.log("DataReportCtrl: ", this.DataReportCtrl)

      //конец присвоения данных для режима редактирования



      this.dropdownSelect.dropCH(this.PersData, this.ChiefCtrl.value, this.ChiefCtrl) //заполнение dropdown элементов ответственного за отчет
      this.dropdownSelect.dropCH(this.LocationData, this.LocationCtrl.value, this.LocationCtrl) //заполнение dropdown элементов локации
    }, 0)
    } else console.log("ReportIdData is null")
  }
  ngAfterViewInit(){
  }

  constructor(private rep: ReportAdd,  private router: Router, private repRed: ReportRed, private snackBar: MatSnackBar) { }

  //начало объявления переменных для CwrWorks
  MethodControl: string = ""
  MethodControlId: number = 0
  MethodAdd($event){ //метод получения данных из dropdown
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
  CustomerAdd($event){ //метод получения данных из dropdown
    console.log("$event CustomerId: ", $event)
    console.log("$event CustomerId: ", $event.valueId)
    this.CustomerId = 0
    this.CustomerId = $event.valueId
    this.Customer = ""
    this.Customer = $event.valueName
    console.log("CustomerId: ", this.CustomerId)
  }
  CwrWorkPersonalsItem: number[] = []
  CwrWorkPersonalsItemFio = []
  CwrWorkPersonalsAdd($event){ //метод получения данных из dropdown
    console.log("$event CwrWorkPersonalsItem: ", $event)

    // for (let i = 0; i < $event.valueId.length; i++) {
    //   this.CwrWorkPersonalsItem.push($event.valueId[i])
    //   this.CwrWorkPersonalsItemFio.push($event.valueName[i])
    // }
    this.CwrWorkPersonalsItem = []
    this.CwrWorkPersonalsItemFio = []
    this.CwrWorkPersonalsItem = this.CwrWorkPersonalsItem.concat($event.valueId)
    this.CwrWorkPersonalsItemFio = this.CwrWorkPersonalsItemFio.concat($event.valueName)
    console.log("CwrWorkPersonalsItem: ", this.CwrWorkPersonalsItem )
    console.log("CwrWorkPersonalsItemFio: ", this.CwrWorkPersonalsItemFio )
    // this.CwrWorkPersonals = this.CwrWorkPersonals.PersonalId.concat($event.value)


  }
  CwrWorkEquipmentsItem = []
  CwrWorkEquipmentsItemFullNameNumber = []
  CwrWorkEquipmentsAdd($event){ //метод получения данных из dropdown
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
  Shown: number = 0;
  Made: number = 0;
  CwrId: number = 0;
  CwrWorkPersonals : any = [{Id: 0, PersonalId: 0, Fio: "", CwrWorkId: 0}]
  CwrWorkEquipments : any = [{Id: 0, EquipmentId: 0, Name: "", CwrWorkId: 0}]

  PersonalName: string //временная, потом удалить
  EquipmentName: string = ""; //временная, потом удалить

  Comment?: string = "";

  //конец объявления переменных для CwrWorks

  reportsCards: CwrWorks[] = []; //Переменная для хранения CwrWorks

  //начало объявления контролов для CwrWorks
  MethodControlCtrl: FormControl = new FormControl('', Validators.required);
  CustomerCtrl: FormControl = new FormControl('', Validators.required);
  CwrWorkPersonalsCtrl: FormControl = new FormControl('', Validators.required)
  CwrWorkEquipmentsCtrl: FormControl = new FormControl('', Validators.required)
  ShownCtrl: FormControl = new FormControl('', Validators.required)
  MadeCtrl: FormControl = new FormControl('', Validators.required)
  CommentCtrl: FormControl = new FormControl('')
  //конец объявления контролов для CwrWorks

  addOnPopup(){ //метод добавления в CwrWorks

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
      console.log("CwrStatusFromPersonals", this.CwrStatusFromPersonals)

      let countCheck = 0; //счетчик при проверке повторяющегося персонала
      for (let j = 0; j < this.reportsPers.length; j++) {
        if (this.reportsPers[j].PersonalStatusName == this.CwrWorkPersonalsItemFio[i]){
          countCheck++
        }
      }
      if (countCheck == 0){
        this.reportsPers.push(new CwrPersonals(this.Id, this.PersonalId, this.CwrId, this.Personal, this.CwrStatusFromPersonals, this.PersonalStatus, this.PersonalStatusName))
        countCheck = 0
      }
      console.log("this.reportsPers:", this.reportsPers)
    }
    for (let i = 0; i < this.CwrWorkEquipmentsItem.length; i++) {
      this.CwrEquipments = this.CwrWorkEquipmentsItemFullNameNumber[i]
      this.EquipmentId = this.CwrWorkEquipmentsItem[i]
      this.Status = "Исправен"
      this.StatusId = 0

      let countCheck = 0; //счетчик при проверке повторяющегося персонала
      for (let j = 0; j < this.reportEquip.length; j++) {
        if (this.reportEquip[j].CwrEquipments == this.CwrWorkEquipmentsItemFullNameNumber[i]){
          countCheck++
        }
      }
      if (countCheck == 0){
        this.reportEquip.push(new CwrEquipments(this.Id, this.EquipmentId, this.Status, this.StatusId, this.CwrId, this.CwrEquipments))
        countCheck = 0
      }
      console.log("reportEquip: ",this.reportEquip)
    }

    this.CwrWorkPersonals = [{Id: 0, PersonalId: 0, Fio: "", CwrWorkId: 0}]
    this.CwrWorkEquipments = [{Id: 0, EquipmentId: 0, Name: "", CwrWorkId: 0}]
    this.popupClose()
    // this.MethodControlCtrl.reset()
    // this.CustomerCtrl.reset()
    // this.CwrWorkPersonalsCtrl.reset()
    // this.CwrWorkEquipmentsCtrl.reset()
    // this.ShownCtrl.reset()
    // this.MadeCtrl.reset()
    // this.CommentCtrl.reset()
  }

  //начало объявления переменных для CwrPersonals
  PersonalAddId: number
  PersonalAddName: string
  PersonalAdd($event){ //метод получения данных из dropdown
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
  StatusAdd($event){ //метод получения данных из dropdown
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

  PersonalStatusName: string = ""; //временная переменная, удалить

  //конец объявления переменных для CwrPersonals
  reportsPers: CwrPersonals [] = [] //Переменная для хранения CwrPersonals

  //начало объявления контролов для CwrPersonals
  CwrPersonalCtrl: FormControl = new FormControl('', Validators.required);
  StatusCtrl: FormControl = new FormControl('', Validators.required);
  CommentCtrl2: FormControl = new FormControl('');
  //конец объявления контролов для CwrPersonals

  addOnPopup2(){ //метод добавления в CwrPersonals
    this.CwrStatusFromPersonals = [{Id: 0, CwrStatusId: 0, CwrPersonalId: 0, DisplayName: ""}]
    for (let i = 0; i < this.StatusCtrl.value.length; i++) {
      this.CwrStatusFromPersonals[i] = { Id: 0, CwrStatusId: this.StatusCtrl.value[i].Id, CwrPersonalId: 0, DisplayName: this.StatusCtrl.value[i].Name}
    }
    console.log("CwrStatusFromPersonals", this.CwrStatusFromPersonals )

    this.PersonalStatusName = this.PersonalAddName
    this.PersonalId = this.PersonalAddId
    this.Comment2 = this.CommentCtrl2.value

    this.reportsPers.push(new CwrPersonals(this.Id, this.PersonalId, this.CwrId, this.Personal, this.CwrStatusFromPersonals, this.PersonalStatus, this.PersonalStatusName, this.Comment2))
    console.log("this.reportsPers:", this.reportsPers)

    this.popupClose2()

  }

  //начало объявления переменных для CwrEquipments
  EquipmentsItem: number = 0
  EquipmentsItemFullNameNumber: string = ""
  EquipmentAdd($event){ //метод получения данных из dropdown
    console.log("$event EquipmentsItem: ", $event.valueId)
    console.log("$event EquipmentsItemFullNameNumber: ", $event.valueName)
    this.EquipmentsItemFullNameNumber = ""
    this.EquipmentsItemFullNameNumber = $event.valueName
    this.EquipmentsItem = 0
    this.EquipmentsItem = $event.valueId
    console.log("EquipmentsItemFullNameNumber: ", this.EquipmentsItemFullNameNumber)
  }

  StatusEqAdd($event){ //метод получения данных из dropdown
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
  Comment3?: string = "";
  //конец объявления переменных для CwrEquipments

  reportEquip: CwrEquipments [] = [] //Переменная для хранения CwrEquipments

  //начало объявления контролов для CwrEquipments
  CwrEquipmentslCtrl: FormControl = new FormControl('', Validators.required);
  StatusEqCtrl: FormControl = new FormControl('', Validators.required);
  CommentCtrl3: FormControl = new FormControl('');
  //конец объявления контролов для CwrEquipments

  addOnPopup3(){ //метод добавления в CwrEquipments
    this.CwrEquipments = this.EquipmentsItemFullNameNumber
    this.EquipmentId = this.EquipmentsItem
    this.Comment3 = this.CommentCtrl3.value
    // this.Status = ""
    this.reportEquip.push(new CwrEquipments(this.Id, this.EquipmentId, this.Status, this.StatusId, this.CwrId, this.CwrEquipments, this.Comment3))
    console.log("reportEquip: ",this.reportEquip)
    this.popupClose3();
  }

  //начало объявления переменных для всего отчета (локация, ответственный, дата)
  СhiefId: number = 0
  ChiefIdAdd($event){ //метод получения данных из dropdown
    console.log("$event СhiefIdAdd: ", $event)
    this.СhiefId = 0
    this.СhiefId = $event.valueId
    console.log("СhiefIdAdd: ", this.СhiefId)
  }
  locationId: number = 0
  LocationIdAdd($event){ //метод получения данных из dropdown
    console.log("$event locationId: ", $event)
    this.locationId = 0
    this.locationId = $event.valueId
    console.log("locationId: ", this.locationId)
  }
  //конец объявления переменных для всего отчета (локация, ответственный, дата)

  //начало объявления контролов для всего отчета (локация, ответственный, дата)
  LocationCtrl: FormControl = new FormControl('', Validators.required);
  ChiefCtrl: FormControl = new FormControl('', Validators.required);
  DataReportCtrl: FormControl = new FormControl('', Validators.required);
  //конец объявления контролов для всего отчета (локация, ответственный, дата)

  maxDate = new Date()

  //начало объявления переменных для CwrFiles
  OriginalName: string = ""
  FullPath: string = ""
  DisplayName: string = ""
  Length: number = 0
  FileType: string = ""
  Ext: string = ""
  IsPreveiw: boolean = false
  Bytes
  Hash: string = ""
  //конец объявления переменных для CwrFiles

  FileCtrl: FormControl = new FormControl('', Validators.required); //контрол для CwrFiles

  reportFile: any [] = [] //Переменная для хранения CwrFiles

  convertDataURIToBinary(dataURI) { //метод конвертирования файла
    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    // console.log("base64!!!!", base64)
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for(let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return base64;
  }

  fileChange(event) { // метод добавления файла
    let fileList: FileList = event.target.files;
    console.log("fileList: ", fileList)
    const file = fileList[0]
    const reader = new FileReader();
    let byteArray: string;
    let byteArrayStr
    if (file) {
      reader.readAsDataURL(file);
    }
    for (let i = 0; i < fileList.length; i++) {
      reader.addEventListener("loadend",  () => {
        byteArray = this.convertDataURIToBinary(reader.result);
        byteArrayStr;
        this.Bytes = byteArray
        this.Id = 0
        this.OriginalName = fileList[i].name
        this.DisplayName = fileList[i].name
        this.reportFile.push(new CwrFiles(this.Id, this.OriginalName, this.FullPath, this.DisplayName, this.Length, this.FileType, this.Ext, this.IsPreveiw, this.CwrId, byteArray, this.Hash) )
        console.log("reportFile: ", this.reportFile)
      }, false);
    }
}

aSub: Subscription; //переменная для отписки от стрима при отправке данных
repAdd: any //переменная для хранения всего отчета перед отправкой
  reportSubmit() {
    this.loading = true //включаем лоадер
    console.log("locationId: ", this.locationId) //получение locationId в консоль
    console.log("СhiefIdAdd: ", this.СhiefId) //получение СhiefIdAdd в консоль
    console.log(this.DataReportCtrl.value) //получение DataReport в консоль

    for (let i = 0; i < this.reportsCards.length; i++) {
      this.reportsCards[i].Customer = null; // обnullяем все Customer для отправки на сервер
    }

    // this.reportsPers[0].Personal = null;
    // this.reportsPers[0].PersonalStatus = null;
    const newrep = { // инициализация объекта перед отправкой на сервер
      Id: this.Id,
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
      CwrFiles: this.reportFile
    }
    console.log("newrep: ", newrep)
    this.repAdd = newrep;
    if (this.statusRed == false){ //проверка в какой мы режиме (добавление или редактирование)
      this.aSub = this.rep.reportAdd(this.repAdd).subscribe( //добавление
        (pers)=>{
          console.log('Отчет отправлен!', pers)
          localStorage.removeItem('ReportAll')
          this.openSnackBar("Отчет успешно создан!", "Ok")
          this.router.navigate(['/reports/list'])
          this.loading = false
        },
        error => {
          this.openSnackBar("Ошибка отправки отчета, проверьте правильность введенных данных", "Ok")
          console.log('Ошибка отправки формы отчета: ')
          this.loading = false
        }
      )
    } else {
      this.aSub = this.repRed.reportRed(this.repAdd, this.getRedId).subscribe( //редактирование
        (repRed) => {
          this.openSnackBar("Отчет отредактирован!", "Ok")
          console.log("Отчет отредактирован! ", repRed)
          this.router.navigate(['/reports/list'])
          this.loading = false
        },
        error => {
          this.openSnackBar("Ошибка отправки отчета", "Ok")
          console.log("Ошибка! отчет не отправлен")
          this.loading = false
        }
      )
    }
  }

  ngOnDestroy(){
    if (this.aSub){
      this.aSub.unsubscribe() //отписка от стрима
    }
    localStorage.removeItem('ReportIdData') //удаление данных редактируемого отчета из localStorage
  }

  @ViewChild(DropdownSelectComponent ) dropdownSelect: DropdownSelectComponent; // получение данных из компонента DropdownSelectComponent
  @ViewChild(DropdownMultiComponent ) dropdownMulti: DropdownMultiComponent; // получение данных из компонента DropdownMultiComponent

  CwrWorksRedItemi = 0
  workNum = 0
  CwrWorksRed(i){ //метод открытия окна редактирования CwrWorks и получение id конкретного CwrWorks и заполнение dropdown данными
    this.popOpenRed = !this.popOpenRed
    this.CwrWorksRedItemi = i
    this.workNum = i + 1

    this.MethodControlCtrl.setValue(this.reportsCards[this.CwrWorksRedItemi].MethodControlId)
    this.dropdownSelect.dropCH(this.MethodData, this.MethodControlCtrl.value, this.MethodControlCtrl)

    this.CustomerCtrl.setValue(this.reportsCards[this.CwrWorksRedItemi].CustomerId)
    this.dropdownSelect.dropCH(this.CustomerData, this.CustomerCtrl.value, this.CustomerCtrl)

    let countPers: number []=[]
    for (let j = 0; j < this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals.length; j++) {
      countPers.push(this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals[j].PersonalId)
    }
    this.dropdownMulti.dropCH(this.PersData, countPers, this.CwrWorkPersonalsCtrl)
    console.log("CwrWorkPersonalsCtrl: ", this.CwrWorkPersonalsCtrl)

    let countEquip = []
    for (let j = 0; j < this.reportsCards[this.CwrWorksRedItemi].CwrWorkEquipments.length; j++) {
      countEquip.push(this.reportsCards[this.CwrWorksRedItemi].CwrWorkEquipments[j].EquipmentId)
    }
    this.dropdownMulti.dropCH(this.EquipData, countEquip, this.CwrWorkEquipmentsCtrl)

    this.ShownCtrl.setValue(this.reportsCards[this.CwrWorksRedItemi].Shown)
    this.MadeCtrl.setValue(this.reportsCards[this.CwrWorksRedItemi].Made)
    this.CommentCtrl.setValue(this.reportsCards[this.CwrWorksRedItemi].Comment)

    // console.log("i: ", i)
  }

  RedOnPopup(){ //метод редактирования CwrWorks

    //добавление в CwrWorks
    console.log("i: ", this.CwrWorksRedItemi)
    this.reportsCards[this.CwrWorksRedItemi].MethodControl = this.MethodControlCtrl.value.Name
    this.reportsCards[this.CwrWorksRedItemi].MethodControlId = this.MethodControlCtrl.value.Id
    this.reportsCards[this.CwrWorksRedItemi].CustomerId = this.CustomerCtrl.value.Id
    this.reportsCards[this.CwrWorksRedItemi].Customer = this.CustomerCtrl.value.Name
    // this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals = [{Id: 0, PersonalId: 0, Fio: "", CwrWorkId: 0}]
    for (let j = 0; j < this.CwrWorkPersonalsCtrl.value.length; j++) {
      if (this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals.length <= this.CwrWorkPersonalsCtrl.value.length){

        this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals[j] = {Id: 0, PersonalId: 0, Fio: "", CwrWorkId: 0}
        this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals[j] = {Id: 0, PersonalId: this.CwrWorkPersonalsCtrl.value[j].Id, Fio: this.CwrWorkPersonalsCtrl.value[j].Name, CwrWorkId: 0}
      } else  {

        this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals = [{Id: 0, PersonalId: 0, Fio: "", CwrWorkId: 0}]
        this.reportsCards[this.CwrWorksRedItemi].CwrWorkPersonals[j] = {Id: 0, PersonalId: this.CwrWorkPersonalsCtrl.value[j].Id, Fio: this.CwrWorkPersonalsCtrl.value[j].Name, CwrWorkId: 0}
      }
    }
    // this.reportsCards[this.CwrWorksRedItemi].CwrWorkEquipments = [{Id: 0, EquipmentId: 0, Name: "", CwrWorkId: 0}]
    for (let j = 0; j < this.CwrWorkEquipmentsCtrl.value.length; j++) {
      if (this.reportsCards[this.CwrWorksRedItemi].CwrWorkEquipments.length <= this.CwrWorkEquipmentsItem.length){
        this.reportsCards[this.CwrWorksRedItemi].CwrWorkEquipments[j] = {Id: 0, EquipmentId: 0, Name: "", CwrWorkId: 0}
        this.reportsCards[this.CwrWorksRedItemi].CwrWorkEquipments[j] = {Id: 0, EquipmentId: this.CwrWorkEquipmentsCtrl.value[j].Id, Name: this.CwrWorkEquipmentsCtrl.value[j].Name, CwrWorkId: 0}
      } else {
        this.reportsCards[this.CwrWorksRedItemi].CwrWorkEquipments = [{Id: 0, EquipmentId: 0, Name: "", CwrWorkId: 0}]
        this.reportsCards[this.CwrWorksRedItemi].CwrWorkEquipments[j] = {Id: 0, EquipmentId: this.CwrWorkEquipmentsCtrl.value[j].Id, Name: this.CwrWorkEquipmentsCtrl.value[j].Name, CwrWorkId: 0}
      }


    }
    this.reportsCards[this.CwrWorksRedItemi].Shown = this.ShownCtrl.value
    this.reportsCards[this.CwrWorksRedItemi].Made = this.MadeCtrl.value
    this.reportsCards[this.CwrWorksRedItemi].Comment = this.CommentCtrl.value

    //добавление в CwrWorkPersonals
    for (let i = 0; i < this.CwrWorkPersonalsItem.length; i++) {
      this.PersonalId = this.CwrWorkPersonalsItem[i]
      this.PersonalStatusName = this.CwrWorkPersonalsItemFio[i]
      this.CwrStatusFromPersonals = [{ Id: 0, CwrStatusId: 4, CwrPersonalId: 0, DisplayName: "Проведение контроля"}]
      console.log("CwrStatusFromPersonals", this.CwrStatusFromPersonals)

      let countCheck = 0; //счетчик при проверке повторяющегося персонала
      for (let j = 0; j < this.reportsPers.length; j++) {
        if (this.reportsPers[j].PersonalStatusName == this.CwrWorkPersonalsItemFio[i]){
          countCheck++
        }
      }
      if (countCheck == 0){
        this.reportsPers.push(new CwrPersonals(this.Id, this.PersonalId, this.CwrId, this.Personal, this.CwrStatusFromPersonals, this.PersonalStatus, this.PersonalStatusName))
        countCheck = 0
      }

      console.log("this.reportsPers:", this.reportsPers)
    }
    //добавление в CwrWorkEquipments
    for (let i = 0; i < this.CwrWorkEquipmentsItem.length; i++) {
      this.CwrEquipments = this.CwrWorkEquipmentsItemFullNameNumber[i]
      this.EquipmentId = this.CwrWorkEquipmentsItem[i]
      this.Status = "Исправен"
      this.StatusId = 0

      let countCheck = 0; //счетчик при проверке повторяющегося персонала
      for (let j = 0; j < this.reportEquip.length; j++) {
        if (this.reportEquip[j].CwrEquipments == this.CwrWorkEquipmentsItemFullNameNumber[i]){
          countCheck++
        }
      }
      if (countCheck == 0){
        this.reportEquip.push(new CwrEquipments(this.Id, this.EquipmentId, this.Status, this.StatusId, this.CwrId, this.CwrEquipments))
        countCheck = 0
      }
      console.log("reportEquip: ",this.reportEquip)
    }


    // this.reportsCards.push(new CwrWorks(this.Id, this.MethodControl,this.CustomerId, this.Shown, this.Made, this.CwrId, this.CwrWorkPersonals, this.CwrWorkEquipments, this.Customer, this.PersonalName, this.EquipmentName))
    console.log("this.reportsCards:", this.reportsCards[this.CwrWorksRedItemi])
    this.popupCloseRed()

  }

  CwrPersonalsRedItemi = 0
  CwrPersonalsRed(i){ //метод открытия окна редактирования CwrPersonals и получение id конкретного CwrPersonals и заполнение dropdown данными
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
  RedOnPopup2(){ //метод редактирования CwrPersonals
    console.log("i: ", this.CwrPersonalsRedItemi)
    this.reportsPers[this.CwrPersonalsRedItemi].CwrStatusFromPersonals = [{Id: 0, CwrStatusId: 0, CwrPersonalId: 0, DisplayName: ""}]
    for (let j = 0; j < this.StatusCtrl.value.length; j++) {
      // this.reportsPers[this.CwrPersonalsRedItemi].CwrStatusFromPersonals[j] = {Id: 0, CwrStatusId: 0, CwrPersonalId: 0, DisplayName: ""}
      this.reportsPers[this.CwrPersonalsRedItemi].CwrStatusFromPersonals[j] = {Id: 0, CwrStatusId: this.StatusCtrl.value[j].Id, CwrPersonalId: 0, DisplayName: this.StatusCtrl.value[j].Name}
    }

    console.log("PersonalAddName: ", this.PersonalAddName)
    console.log("CwrPersonalCtrl: ",this.CwrPersonalCtrl.value)
    this.reportsPers[this.CwrPersonalsRedItemi].PersonalStatusName = this.CwrPersonalCtrl.value.Name
    this.reportsPers[this.CwrPersonalsRedItemi].PersonalId = this.CwrPersonalCtrl.value.Id
    this.reportsPers[this.CwrPersonalsRedItemi].Comment = this.CommentCtrl2.value

    this.popupCloseRed2()
  }

  CwrEquipmentsRedItemi = 0
  CwrEquipmentsRed(i){ //метод открытия окна редактирования CwrEquipments и получение id конкретного CwrEquipments и заполнение dropdown данными
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
  RedOnPopup3(){ //метод редактирования CwrEquipments
    console.log("i: ", this.CwrEquipmentsRedItemi)
    console.log("CwrEquipmentslCtrl: ", this.CwrEquipmentslCtrl.value)
    this.reportEquip[this.CwrEquipmentsRedItemi].CwrEquipments = this.CwrEquipmentslCtrl.value.Name
    // this.EquipmentsItemFullNameNumber
    this.reportEquip[this.CwrEquipmentsRedItemi].EquipmentId = this.CwrEquipmentslCtrl.value.Id
    this.reportEquip[this.CwrEquipmentsRedItemi].Status = this.StatusEqCtrl.value.Name
    this.reportEquip[this.CwrEquipmentsRedItemi].Comment = this.CommentCtrl3.value
    this.popupCloseRed3()
  }
  openSnackBar(message: string, action: string) { //метод для вспывающего окна с информацией
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  loading = false; //переменная для лоадера

  tabsBg = true;
  tabsBg2 = false;
  tabsBg3 = false;

  popOpen = false;
  popOpen2 = false;
  popOpen3 = false;
  popLoader = true

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
    this.popOpen = true
  }
  popupClose(){
    this.popOpen = false
    this.MethodControlCtrl.reset()
    this.CustomerCtrl.reset()
    this.CwrWorkPersonalsCtrl.reset()
    this.CwrWorkEquipmentsCtrl.reset()
    this.ShownCtrl.reset()
    this.MadeCtrl.reset()
    this.CommentCtrl.reset()
  }
  popupHidden(){
    this.popOpen = false
  }

  popupOpen2(){
    this.popOpen2 = true

  }
  popupClose2(){
    this.popOpen2 = false
    this.CwrPersonalCtrl.reset()
    this.StatusCtrl.reset()
    this.CommentCtrl2.reset()
  }
  popupHidden2(){
    this.popOpen2 = false
  }

  popupOpen3(){
    this.popOpen3 = true
  }
  popupClose3(){
    this.popOpen3 = false
    this.CwrEquipmentslCtrl.reset()
    this.StatusEqCtrl.reset()
    this.CommentCtrl3.reset()
  }
  popupHidden3(){
    this.popOpen3 = false
  }

  popupOpenRed(){
    this.popOpenRed = true
  }
  popupCloseRed(){
    this.popOpenRed = false
    this.MethodControlCtrl.reset()
    this.CustomerCtrl.reset()
    this.CwrWorkPersonalsCtrl.reset()
    this.CwrWorkEquipmentsCtrl.reset()
    this.ShownCtrl.reset()
    this.MadeCtrl.reset()
    this.CommentCtrl.reset()
  }
  popupHiddenRed(){
    this.popOpenRed = false
    this.MethodControlCtrl.reset()
    this.CustomerCtrl.reset()
    this.CwrWorkPersonalsCtrl.reset()
    this.CwrWorkEquipmentsCtrl.reset()
    this.ShownCtrl.reset()
    this.MadeCtrl.reset()
    this.CommentCtrl.reset()
  }

  popupOpenRed2(){
    this.popOpenRed2 = !this.popOpenRed2
  }
  popupCloseRed2(){
    this.popOpenRed2 = false
    this.CwrPersonalCtrl.reset()
    this.StatusCtrl.reset()
    this.CommentCtrl2.reset()
  }
  popupHiddenRed2(){
    this.popOpenRed2 = false
    this.CwrPersonalCtrl.reset()
    this.StatusCtrl.reset()
    this.CommentCtrl2.reset()
  }

  popupOpenRed3(){
    this.popOpenRed3 = true
  }
  popupCloseRed3(){
    this.popOpenRed3 = false
    this.CwrEquipmentslCtrl.reset()
    this.StatusEqCtrl.reset()
    this.CommentCtrl3.reset()
  }
  popupHiddenRed3(){
    this.popOpenRed3 = false
    this.CwrPersonalCtrl.reset()
    this.StatusCtrl.reset()
    this.CommentCtrl2.reset()
  }
}
