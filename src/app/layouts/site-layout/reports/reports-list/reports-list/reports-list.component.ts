import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { config, Observable, Subscription } from 'rxjs';
import { ReportAll } from 'src/app/layouts/services/reports-all.service';
import { ReportsAll, Config} from 'src/app/layouts/services/interfaces'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownMultiComponent } from 'src/app/layouts/classes/dropdown-classes/dropdown-multi/dropdown-multi.component';
import { Router } from '@angular/router';
import { ReportGet } from 'src/app/layouts/services/report-get.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportDel } from 'src/app/layouts/services/report-delete.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ReportFilter } from 'src/app/layouts/services/reports-filter.service';
import { environment } from 'src/environments/environment';
import { ConfigServ } from 'src/app/layouts/services/config.service';

export class NewDropdown {
  constructor(
              public Id: number,
              public Name: string,
              public Display: boolean,
              public IsSelect: boolean
  ) {}
}

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css', './report-list-media.component.css']
})

export class ReportsListComponent implements OnInit, OnDestroy {
  reportsAll: ReportsAll[] = [] // переменная, хранящая массив всех отчетов

  //работа со временем и датами для фильтров
  now = new Date();
  hours = this.now.getHours() * 60 * 60 * 1000
  minutes = this.now.getMinutes() * 60 * 1000
  seconds = this.now.getSeconds() * 1000
  milsec = this.now.getMilliseconds()
  AllMilSec = this.hours + this.minutes + this.seconds + this.milsec
  today = new Date (this.now.getTime() - (this.AllMilSec))
  tomorrow = new Date(this.now.getTime() + (1000 * 60 * 60 * 24) - (this.AllMilSec))
  yesterday = new Date(this.now.getTime() - (1000 * 60 * 60 * 24) - (this.AllMilSec))
  beforeYesterday = new Date(this.now.getTime() - (1000 * 60 * 60 * 24) - (1000 * 60 * 60 * 24) - (this.AllMilSec))
  TwoDayBeforeYesterday = new Date(this.now.getTime() - (1000 * 60 * 60 * 24) - (1000 * 60 * 60 * 24) - (1000 * 60 * 60 * 24) - (this.AllMilSec))
  // конец работы со временем и датами для фильтров

  aSub: Subscription; // Переменная для отписки от потока
  filterSub: Subscription; // Переменная для отписки от потока


  Filter = { // базовая модель фильтра
    ReportId: 0,
    FromDate: null,
    ToDate: null,
    ChiefIds: null,
    GeneralLocIds: null,
    SubLocIds: null
  }

  constructor(private repFilter: ReportFilter ,private repAll: ReportAll, private dropDown: DropdownMultiComponent, private router: Router, private repGet: ReportGet, private snackBar: MatSnackBar, private repDel: ReportDel, private changeDetectorRef: ChangeDetectorRef, private configPost: ConfigServ) {
    //задаем начальные значения даты для применения фильтра на старте страницы
    this.Filter.FromDate = this.yesterday
    this.Filter.ToDate = this.today
    // this.ConfigCookies()


  }

  pers = JSON.parse(localStorage.getItem('Personal')) //Получаем данные всех пользователей
  PersData: NewDropdown [] = []; // Объект с итерфейсом NewDropdown, куда мы в дальнейшем присваиваем пользователей
  location = JSON.parse(localStorage.getItem('Locations')) //Получаем данные все локации
  LocationData: NewDropdown [] = []; // Объект с итерфейсом NewDropdown, куда мы в дальнейшем присваиваем локации
  GeneralLocations = JSON.parse(localStorage.getItem('GeneralLocations')) //Получаем данные GeneralLocations

  loading: boolean = false; // Переменная лоадера

  //paginator__________start
  @ViewChild(MatPaginator) paginator: MatPaginator;

  paginatorPageSize = 4
  pageSizeOptions = [2, 4, 6, 8]

  obs: Observable<any>;
  dataSource: MatTableDataSource<ReportsAll>

  ConnectToPagginList(){ //Метод для подключения новых результатов отчета в пагинатор

    this.reportsAll.reverse()
    this.dataSource = new MatTableDataSource<ReportsAll>(this.reportsAll);
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;

    this.obs = this.dataSource.connect();
  }
  //paginator__________end

  //Контролы фильтра
  FromDateCtrl: FormControl = new FormControl(null)
  ToDateCtrl: FormControl = new FormControl(null)
  ReportIdCtrl: FormControl = new FormControl('0')
  ChiefIdsCtrl: FormControl = new FormControl(null)
  SubLocIdsCtrl: FormControl = new FormControl(null)

  ngOnInit(){
    // this.ConfigCookies()
    if (localStorage.getItem('SaveFilter') != null){
      this.LoadControls()
    }
    //Заполняем объекты с интерфейсом NewDropdown
    let Id
    let Name
    let Display
    let IsSelect
    for (let i = 0; i < this.pers.length; i++) {
      if (this.pers[i].StatusWork !== "Уволен"){ //Не добавляем уволенных
        Id = this.pers[i].Id
        Name = this.pers[i].Name + " " + this.pers[i].LastName
        Display = true
        IsSelect = false
        this.PersData.push(new NewDropdown(Id, Name, Display, IsSelect))
      }
    }
    for (let i = 0; i < this.location.length; i++) { //Не добавляем неактуальные
      if (this.location[i].Actual == 1){
        Id = this.location[i].Id
        Name = this.location[i].SmallName
        Display = true
        IsSelect = true
        this.LocationData.push(new NewDropdown(Id, Name, Display, IsSelect))
      }
    }


    this.loading = true; //Включаем лоадер

    if (localStorage.getItem('ReportAll') !== null) { //Проверяем есть ли массив в хранилище
      if (JSON.parse(localStorage.getItem('ReportAll')).length == 0){ //Проверяем пустой ли массив в хранилище
        localStorage.removeItem('ReportAll')  //Удаляем, если пустой
      }
    }

    if (localStorage.getItem('ReportAll') == null){ //Если массив в хранилище пустой, то отправляем стартовый запрос
      // setTimeout(() => { //Задержка для успешной отправки базового фильтра
        console.log("this.Filter: ", this.Filter)
        this.aSub = this.repAll.reportAll(this.Filter).subscribe(
          (AllData) => {
            console.log("Filter is work! AllData", AllData)
            console.log("AllData.ChiefWorkReports:", AllData.ChiefWorkReports)
            //сохраняем полученные отчеты в хранилище
            const reportData = JSON.stringify(AllData.ChiefWorkReports)
            localStorage.setItem('ReportAll', reportData)
            this.reportsAll = JSON.parse(localStorage.getItem('ReportAll'))
            //Получаем и сохраняем статусы пользователя для создания отчётов
            let PesonalStatusesWork: any [] = [];
            let PesonalStatuses: any [] = [];
            for (let i = 0; i < AllData.CwrPesonalStatuses.length; i++) {
              if (AllData.CwrPesonalStatuses[i].IsWork == true){
                PesonalStatusesWork.push(AllData.CwrPesonalStatuses[i])
              } else {
                PesonalStatuses.push(AllData.CwrPesonalStatuses[i])
              }
            }
            const PesonalStatusesWorkC = JSON.stringify(PesonalStatusesWork)
            localStorage.setItem('PesonalStatusesWork', PesonalStatusesWorkC)

            const PesonalStatusesC = JSON.stringify(PesonalStatuses)
            localStorage.setItem('PesonalStatuses', PesonalStatusesC)

            const FiterChiefsForDisable = JSON.stringify(AllData.FiterChiefs)
            localStorage.setItem('FiterChiefsForDisable', FiterChiefsForDisable)

            const FiterLocationsForDisable = JSON.stringify(AllData.FiterLocations)
            localStorage.setItem('FiterLocationsForDisable', FiterLocationsForDisable)

            this.loading = false; //Отключаем лоадер

            //уведомляем, если отчетов нет
            if (this.reportsAll.length == 0){
              console.log("reportsAll == undefined!!!")
              this.openSnackBar("За сегодня ни одного отчета не найдено", "Ok")
            } else {
              this.openSnackBar(`Найдено отчётов: ${this.reportsAll.length}` , "Ok")
            }
            //Сортируем получаенные отчеты по дате
            this.reportsAll.sort((a, b) => {
              return moment(a.DataReport).toDate().getTime() > moment(b.DataReport).toDate().getTime() ? 1 : -1;
            })
            this.ConnectToPagginList() // подключаем новые результаты отчета в пагинатор
          },
          (error) => {
            console.log("Filter don`t work!")
          }
        )
      // }, 3000)

    } else { //Добавляем отчёты из хранилища, если они там есть
      this.reportsAll = JSON.parse(localStorage.getItem('ReportAll'))
      this.ConnectToPagginList()
      this.loading = false;
      this.openSnackBar(`Последний примененный фильтр. Найдено отчётов: ${this.reportsAll.length} ` , "Ok")
    }
      //Приминение кофига
      let config = JSON.parse(localStorage.getItem('Config'))
      let configView: Config = config.find(x => x.GroupName == "Отображение отчёта")
      if (configView != undefined){
        if (configView.Value == "Grid"){
          this.viewList = false
          this.viewGrid = true
        } else {
          this.viewList = true
          this.viewGrid = false
        }
      }
      console.log("config", configView)
      let configPaggStep: Config = config.find(x => x.GroupName == "Шаг пагинации")
      if (configPaggStep != undefined){
        this.paginatorPageSize = JSON.parse(configPaggStep.Value)
      }

  }

  FilterSubmit(){ //Метод отправки фильтра
    localStorage.removeItem('newRepParam') //Удаляем параметр, которой возникает при добавлении нового отчёта

    this.loading = true; //Включаем лоадер

    //Заполяем ответственных и локации для фильтра
    let ChiefIdsList: any [] = []
    let SubLocIdsList: any [] = []
    if (this.ChiefIdsCtrl.value !== null){
      for (let i = 0; i < this.ChiefIdsCtrl.value.length; i++) {
        ChiefIdsList.push(this.ChiefIdsCtrl.value[i].Id)
      }
    } else {
      ChiefIdsList = null
    }

    if (this.SubLocIdsCtrl.value !== null)
    for (let i = 0; i < this.SubLocIdsCtrl.value.length; i++) {
      SubLocIdsList.push(this.SubLocIdsCtrl.value[i].Id)
    } else {
      SubLocIdsList = null
    }
    //Проверка дня "от" и "до", если ранвы, то "до" = null
    if ((this.FromDateCtrl.value != null)&&(this.ToDateCtrl.value != null)){
      if (this.FromDateCtrl.value._d.getTime() == this.ToDateCtrl.value._d.getTime()){
        const newDate = new Date(this.FromDateCtrl.value);
        const result = new Date(newDate.setDate(newDate.getDate() + 1));
        console.log(result);
        this.ToDateCtrl.setValue(result)
        // this.ToDateCtrl.setValue(null)
      }
    }

    //Заполняем фильтр перед отправкой на сервер
    this.Filter = {
      ReportId: this.ReportIdCtrl.value,
      FromDate: this.FromDateCtrl.value,
      ToDate: this.ToDateCtrl.value,
      ChiefIds: ChiefIdsList,
      GeneralLocIds: null,
      SubLocIds: SubLocIdsList
    }
    if (this.ReportIdCtrl.value == null) { // проверяем поле "номер отчета" на null
      this.Filter.ReportId = 0
    }

    if ((this.Filter.ReportId == 0) && (this.Filter.FromDate == null) && (this.Filter.ChiefIds == null) && (this.Filter.SubLocIds == null)){ // Проверка на пустой фильтр
      this.loading = false;
      this.openSnackBar("Фильтр не может быть пустым!", "Ok")
      } else {
        this.filterSub = this.repFilter.reportFilter(this.Filter).subscribe( //Отправляем запрос
        (FilterData)=>{
            console.log("FilterSubmit is Submit! Data:", FilterData);
              if (FilterData.length > 250){ // Проверка на количество полученных отчётов
                this.openSnackBar("Вы загружаете слишком много отчетов, выберите меньший диапазон дат", "Ok")
                } else {
                  //Добавляем отчеты в хранилище
                  const filterData = JSON.stringify(FilterData)
                  localStorage.setItem('ReportAll', filterData)
                  this.reportsAll = JSON.parse(localStorage.getItem('ReportAll'))
                  console.log("reportsAll: ", this.reportsAll)

                  if (this.reportsAll.length == 0){ //Проверка есть ли отчёты
                    console.log("reportsAll == undefined!!!")
                    this.openSnackBar("Ни одного отчета не найдено", "Ok")
                   } else {
                      this.openSnackBar(`Найдено отчётов: ${this.reportsAll.length}` , "Ok")
                    }
                  this.ConnectToPagginList()

                  this.SaveControls()

                }

              this.loading = false; //отключаем лоадер

              //Обнуляем фильтр
              // this.reset()
              this.LocationDisplayTrue()
            },
              () => {
                this.loading = false;
                console.log("FilterSubmit is not a Submit!");

                this.openSnackBar("Возникла непредвиденная ошибка, перезагрузите страницу", "Ok")
              }
      )
    }
  }
  SaveControls(){
    const SaveControls = {
      fromDate: this.FromDateCtrl.value,
      toDate: this.ToDateCtrl.value,
      reportId: this.ReportIdCtrl.value,
      chiefId: this.ChiefIdsCtrl.value,
      subLockId: this.SubLocIdsCtrl.value
    }
    localStorage.setItem('SaveFilter', JSON.stringify(SaveControls))
  }

  LoadControls(){
    let LoadControls = JSON.parse(localStorage.getItem('SaveFilter'))
    this.FromDateCtrl.setValue(LoadControls.fromDate)
    this.ToDateCtrl.setValue(LoadControls.toDate)
    this.ReportIdCtrl.setValue(LoadControls.reportId)
    // this.ChiefIdsCtrl.setValue([LoadControls.chiefId])
    // this.SubLocIdsCtrl.setValue(LoadControls.subLockId)
    // console.log('ChiefIdsCtrl', this.ChiefIdsCtrl.value)
  }
  resetControls(){
    this.FromDateCtrl.reset()
    this.ToDateCtrl.reset()
    this.ReportIdCtrl.reset()
    this.ChiefIdsCtrl.reset()
    this.SubLocIdsCtrl.reset()
  }
  FilterToday(){ //Метод вызова отчетов за сегодня
    localStorage.removeItem('newRepParam')
    this.loading = true;
    this.Filter = {
      ReportId: 0,
      FromDate: this.yesterday,
      ToDate: this.today,
      ChiefIds: null,
      GeneralLocIds: null,
      SubLocIds: null
    }

    this.aSub = this.repFilter.reportFilter(this.Filter).subscribe(
      (AllData) => {
        console.log("Filter today is work!", AllData)
        console.log("AllData:", AllData)
        const reportData = JSON.stringify(AllData)
        localStorage.setItem('ReportAll', reportData)
        this.reportsAll = JSON.parse(localStorage.getItem('ReportAll'))

        // const PesonalStatuses = JSON.stringify(AllData.CwrPesonalStatuses)
        // localStorage.setItem('PesonalStatuses', PesonalStatuses)
        if (this.reportsAll.length == 0){
          console.log("reportsAll == undefined!!!")
          this.openSnackBar("За сегодня ни одного отчета не найдено", "Ok")
          localStorage.removeItem('ReportAll')
        } else {
          this.openSnackBar(`Найдено отчётов: ${this.reportsAll.length}` , "Ok")
        }
        this.ConnectToPagginList()
        this.loading = false;
      },
      (error) => {
        console.log("Filter don`t work!")
        this.loading = false;
      }
    )
    this.resetControls()
  }

  FilterReset(){ //Сброс фильтра
    localStorage.removeItem('newRepParam')
    localStorage.removeItem('ReportAll')
    localStorage.removeItem('SaveFilter')
    this.FromDateCtrl.reset()
    this.ToDateCtrl.reset()
    this.ReportIdCtrl.reset()
    this.ChiefIdsCtrl.reset()
    this.SubLocIdsCtrl.reset()
    this.openSnackBar("Фильры успешно очищены", "Ок")
    this.LocationDisplayTrue()
  }

  FiterChiefsForDisable = JSON.parse(localStorage.getItem('FiterChiefsForDisable'))
  PersFilterIdAdd($event){ //Получаем список сотрудников
    console.log("$event PersFilter: ", $event)
    this.FiterChiefsForDisable = JSON.parse(localStorage.getItem('FiterChiefsForDisable'))
    let FilterChiefItem: any [] = [];
    for (let i = 0; i < $event.valueId.length; i++) {
      FilterChiefItem.push(this.FiterChiefsForDisable.find(x => x.Id == $event.valueId[i]))
    }
    console.log('FilterChiefItem', FilterChiefItem)

    for (let i = 0; i < this.LocationData.length; i++) {
      this.LocationData[i].Display = false
    }
    if (FilterChiefItem != undefined){
      for (let i = 0; i < this.LocationData.length; i++) {
        for(let k = 0; k < FilterChiefItem.length; k++)  {
          for (let j = 0; j < FilterChiefItem[k]?.SubLocations.length; j++) {
            if (this.LocationData[i].Id == FilterChiefItem[k].SubLocations[j]){
              this.LocationData[i].Display = true
            }
          }
        }
      }
    }
    if ($event.valueId.length == 0){
      for (let i = 0; i < this.LocationData.length; i++) {
        this.LocationData[i].Display = true
      }
    }
  }

  FiterLocationsForDisable = JSON.parse(localStorage.getItem('FiterLocationsForDisable'))
  LocationFilterIdAdd($event){ //Получаем список Локаций
    console.log("$event locationFilter: ", $event)
    this.FiterLocationsForDisable = JSON.parse(localStorage.getItem('FiterLocationsForDisable'))

    let FilterLockItem: any [] = []
    for (let i = 0; i < $event.valueId.length; i++) {
      FilterLockItem.push(this.FiterLocationsForDisable.find(x => x.Id == $event.valueId[i]))
    }
    console.log('FilterLockItem', FilterLockItem)
    if (FilterLockItem != undefined){
      for (let i = 0; i < this.PersData.length; i++) {
        for (let k = 0; k < FilterLockItem.length; k++) {
          for (let j = 0; j < FilterLockItem[k]?.ChiefIds.length; j++) {
            if (this.PersData[i].Id == FilterLockItem[k].ChiefIds[j]){
              this.PersData[i].Display = true
            }
          }
        }
      }
    }

    if ($event.valueId.length == 0){
      for (let i = 0; i < this.PersData.length; i++) {
        this.PersData[i].Display = true
      }
    }
  }

  LocationDisplayTrue(){
    for (let i = 0; i < this.LocationData.length; i++) {
      this.LocationData[i].Display = true
    }
  }

  FromDateVal = ""
  FromDateItem($event){ //Получаем дату от
    console.log("$event FromDateItem: ", $event.value)
    this.FromDateVal = $event.value
    console.log("FromDateVal: ", this.FromDateVal)
  }
  ToDateVal = ""
  ToDateItem($event){ //Получаем дату до
    console.log("$event ToDateItem: ", $event.value)
    this.ToDateVal = $event.value
    console.log("ToDateVal: ", this.ToDateVal)
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }

  getChiedName(report: ReportsAll){ //Получаем данные ответственного
    let chiefObj
    let chiefName
      if ((report.СhiefUserId !== 3) && (report.СhiefUserId !== 0) ){
      // console.log("chiefId.СhiefUserId", report.СhiefUserId)
      chiefObj = this.pers.find(x => x.Id == report.СhiefUserId)
      chiefName = chiefObj.SmalFio
    } else chiefName = "Ошибка чтения: сотрудник не существует"
      return chiefName
  }

  getChiedId(report: ReportsAll){ //Получаем id ответственного
    let chiefObj
    let chiefId
      if ((report.СhiefUserId !== 3) && (report.СhiefUserId !== 0) ){
      // console.log("chiefId.СhiefUserId", report.СhiefUserId)
      chiefObj = this.pers.find(x => x.Id == report.СhiefUserId)
      chiefId = chiefObj.Id
    } else chiefId = "Ошибка чтения: сотрудник не существует"
      return chiefId
  }

  getSubLockName(report){ // Получаем локацию
    // console.log("report.SubLocationId", report.SubLocationId)
    let LockfObj
    let LockfName
    if (report.SubLocationId !== 0){
      LockfObj = this.location.find(x => x.Id == report.SubLocationId)
      // console.log("LockfObj", LockfObj)
      LockfName = LockfObj.SmallName
    } else LockfName = "Ошибка чтения: локация не существует"

    return LockfName
  }

  getPersInWork(report){
    let count = 0;
    for (let i = 0; i < report.length; i++) {
      if (report[i].ForTabPerStatusId == 18){
        count++;
      }
    }
    return count;
  }
  getPersDontWork(report){
    let count = 0;
    for (let i = 0; i < report.length; i++) {
      if (report[i].ForTabPerStatusId == 11){
        count++;
      }
    }
    return count;
  }
  getEqDontWork(report){
    let count = 0;
    for (let i = 0; i < report.length; i++) {
      if (report[i].Status == "Не исправен"){
        count++;
      }
    }
    return count;
  }
  getFileDisplayName(report){

  }
  SaveFile(files){
    console.log("this.reportView[i].FullPath: ", files.FullPath)
    const linkSource = `${environment.apiUrl}/api/cwr/getfile?id=${files.Id}`
    const downloadLink = document.createElement("a");
    const fileName = files.DisplayName

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
  // Cookie(){
  //   document.cookie = "report-view-module=list"
  //   console.log("Cookie work!", document.cookie)
  // }
  getLength(report){ //Получаем количество
    return  report.length
  }
  getLogo(generalLoc){ //Получаем лого
    let GeneralLogoLink
    GeneralLogoLink = this.GeneralLocations.find(x => x.Id == generalLoc)
    return GeneralLogoLink.Logo
  }

  FormatDate(date){ //Получаем дату
    date = formatDate(date, 'dd.MM.yyyy', 'en-US', '+0530');
    return date
  }

  //Начало работы с разрешениями
  accessLvl: number = JSON.parse(localStorage.getItem('AccessLevel'))
  userId = JSON.parse(localStorage.getItem('Id'))
  userAccessLvl = JSON.parse(localStorage.getItem('UserData')).MyPerson.UsersRolles
  HashRepRed = "77505032-23DD-4115-A7D5-5A39B52D88C9"
  AccessLevelCheck(report){
    let userRepRedLvl = this.userAccessLvl.find(x => x.Id == 38)
    let userRepRedLvlHash = ""

    if (userRepRedLvl !== undefined){
      userRepRedLvlHash = userRepRedLvl.HashId
    }

    let dataCreate = new Date(report.DataCreate)
    let lastDayAccess = this.now.getTime() - dataCreate.getTime()
    let oneDay = 1000 * 60 * 60 * 24

    if ((this.accessLvl >= 5)){
      return true
    } else if ( (this.HashRepRed == userRepRedLvlHash)){
      return true
    } else if ((this.userId == report.UserId) && (lastDayAccess < oneDay)){
      return true
    }
    else {
      return false
    }
  }
  //Конец работы с разрешениями

  reportRedSub: Subscription
  NavigateToRepRed(i){ //Открыть конкретный отчёт для редактирования

    this.reportRedSub = this.repGet.repGet(i).subscribe( //Запрос на получение конкретного отчёта
      (reportIdData)=>{
        console.log("reportIdData: ", reportIdData)
        let newReportIdData = JSON.stringify(reportIdData)
        localStorage.setItem('ReportIdData', newReportIdData)
        this.router.navigate(['/reports/add-report'])
      }
    )

  }
   ReportView(i){ //Открыть конкретный отчёт для просмотра
    this.reportRedSub = this.repGet.repGetNearby(i).subscribe(
      (reportIdData)=>{
        console.log("reportViewData: ", reportIdData)
        let newReportIdData = JSON.stringify(reportIdData)
        localStorage.setItem('ReportViewData', newReportIdData)
        this.router.navigate(['/view-report'])
      }
    )
  }

  //Начало удаления отчета
  repDeleteWind = false
  delYesNo = false
  reportId;
  reportItem;
  i;
  popupDelOpen(reporti, report, i){ //Открыть диалоговое окно
    this.repDeleteWind = true

    this.reportId = reporti
    this.reportItem = report
    this.i = i

  }
  reportDelSub: Subscription

  ReportDel(i){//Метод удаления
      this.reportDelSub = this.repDel.repDel(this.reportId, this.reportItem).subscribe( //Отправка запроса на удаление
        () => {
          console.log("Удаление прошло успешно!")
          // localStorage.removeItem('newRepParam')
          // console.log("Удаление прошло успешно!", i)
          this.openSnackBar("Удаление прошло успешно", "Ok")
          this.repDeleteWind = false
          this.reportsAll.reverse()
          this.reportsAll.splice(i, 1)
          // let RepAllList: [] = JSON.parse(localStorage.getItem('ReportAll'))
          // RepAllList.reverse()
          // RepAllList.splice(i, 1)
          // console.log("RepAllList", RepAllList)
          localStorage.setItem('ReportAll', JSON.stringify(this.reportsAll))
          this.dataSource = new MatTableDataSource<ReportsAll>(this.reportsAll);
          this.changeDetectorRef.detectChanges();
          this.dataSource.paginator = this.paginator;

          this.obs = this.dataSource.connect();
        },
        () => {
          console.log("Ошибка удаления отчёта!")
        }
      )

  }
  //Конец удаления отчета

  ViewConfig = {
    name: "Отображение отчёта",
    model: ""
  }
  viewList = true
  viewGrid = false
  reportViewList(){
    this.viewList = true
    this.viewGrid = false
    this.ViewConfig.model = "List"
    console.log("ViewConfig: ", this.ViewConfig)
    this.Config()
  }
  reportViewGrid(){
    this.viewList = false
    this.viewGrid = true
    this.ViewConfig.model = "Grid"
    console.log("ViewConfig: ", this.ViewConfig)
    this.Config()
  }
  // viewList = false
  // reportViewList(){
  //   this.viewList = !this.viewList
  // }
  newReportView(i){
    let newRepParam = JSON.parse(localStorage.getItem('newRepParam'))
    if ((i == 0) && (newRepParam == 1) ){
      return true
    } else {
      return false
    }
  }
  filterMobileCheck: boolean = false;
  filterMobileOpen(){
    this.filterMobileCheck = true
  }
  PaggStepConfig = {
    name: "Шаг пагинации",
    value: ""
  }
  pageEvent: PageEvent;
  PageEventPag($event){
    this.pageEvent = $event
    console.log("this.pageEvent: ", this.pageEvent.pageSize)
    let pageCont = JSON.stringify(this.pageEvent.pageSize)
    this.PaggStepConfig.value = pageCont
    const configData = {
      Id: 0,
      GroupName: this.PaggStepConfig.name,
      Name: "Пагинация",
      Value: this.PaggStepConfig.value,
      UserId: JSON.parse(localStorage.getItem('Id'))
    }
    this.configPost.ConfigPost(configData).subscribe((data) => {
      console.log("Config is work! data: ", data)
    })
    // document.cookie = `report-paginator-page=${pageCont}`
  }
  Config(){
    const configData = {
      Id: 0,
      GroupName: this.ViewConfig.name,
      Name: "Вид отчета",
      Value: this.ViewConfig.model,
      UserId: JSON.parse(localStorage.getItem('Id'))
    }

    this.configPost.ConfigPost(configData).subscribe((data) => {
      console.log("Config is work! data: ", data)
      let configData = JSON.parse(localStorage.getItem('Config'))

      let configIndex = configData.findIndex(x => x.GroupName == 'Отображение отчёта')
      console.log('test', configIndex)

      configData[configIndex] = data
      console.log('configData', configData)
    },
    () => {
      console.log("Config dont work! ")
    }
    )
    // if(document.cookie == "report-view-module=grid"){
    //   this.viewList = false
    //   this.viewGrid = true
    // } else if (document.cookie == "report-view-module=list"){
    //   this.viewList = true
    //   this.viewGrid = false
    // }

  }
  ngOnDestroy(){
    if(this.aSub){
      this.aSub.unsubscribe()
    }
    if (this.filterSub){
      this.filterSub.unsubscribe()
    }
    if (this.reportRedSub){
      this.reportRedSub.unsubscribe()
    }
    localStorage.removeItem('newRepParam')

  }
}
