import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartSevices } from '../layouts/services/chart-services';
// import { single } from '../data/data';

export class NewDropdown {
  constructor(
              public Id: number,
              public Name: string,
              public Display: boolean,
              public IsSelect: boolean
  ) {}
}
export var single = [
  {
    "name": "Брак (пересветы)",
    "value": 15
  },
  {
    "name": "Передано заключений заказчику по актам приёма передачи",
    "value": 120
  },
  {
    "name": "Оформлено заключений через ПО",
    "value": 155
  },
  {
    "name": "Выполнено по отчётам",
    "value": 264
  }
];

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  single: any[];
  view: any = [500, 200];

  // options
  showXAxis: boolean = false;
  showYAxis: boolean = false;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = 'Горизонтальная';
  showYAxisLabel: boolean = false;
  xAxisLabel: string = 'Вертикальная';
  showGridLines: boolean = true
  showDataLabel: boolean = true

  colorScheme = {
    domain: ['#B7B67B', '#A0C13F', '#085C53', '#06293F'],
  };

  singleData = [
    {
      name: "Брак (пересветы)",
      value: 15
    },
    {
      name: "Передано заключений заказчику по актам приёма передачи",
      value: 120
    },
    {
      name: "Оформлено заключений через ПО",
      value: 155
    },
    {
      name: "Выполнено по отчётам",
      value: 264
    }
  ];

  constructor(private chartServices: ChartSevices) {
    Object.assign(this, { single });
  }

  LocationData: NewDropdown [] = []
  location = JSON.parse(localStorage.getItem('Locations')) //Получаем данные все локации
  CustomerData: NewDropdown [] = []
  customer = JSON.parse(localStorage.getItem('Customers')) //Получаем данные всех пользователей
  MethodData: NewDropdown [] = []
  method =  JSON.parse(localStorage.getItem('MethodControl'))

  LocationCtrl: FormControl = new FormControl(null)
  CustomerCtrl: FormControl = new FormControl(null)
  MethodCtrl: FormControl = new FormControl(null)

  ngOnInit() {
    //Заполняем объекты с интерфейсом NewDropdown
    let Id
    let Name
    let Display
    let IsSelect
    for (let i = 0; i < this.location.length; i++) { //Не добавляем неактуальные
      if (this.location[i].Actual == 1){
        Id = this.location[i].Id
        Name = this.location[i].SmallName
        Display = true
        IsSelect = true
        this.LocationData.push(new NewDropdown(Id, Name, Display, IsSelect))
      }
    }
    for (let i = 0; i < this.customer.length; i++) {
      if (this.customer[i].IsActual == true){ //Не добавляем уволенных
        Id = this.customer[i].Id
        Name = this.customer[i].SmallName
        Display = true
        IsSelect = false
        this.CustomerData.push(new NewDropdown(Id, Name, Display, IsSelect))
      }
    }
    for (let i = 0; i < this.method.length; i++) {
      if (this.method[i].StatusWork !== "Уволен"){ //Не добавляем уволенных
        Id = this.method[i].Id
        Name = this.method[i].Name
        Display = true
        IsSelect = false
        this.MethodData.push(new NewDropdown(Id, Name, Display, IsSelect))
      }
    }
  }

  LocationSelect: number [] = []
  LocationDropdownChange($event){
    console.log('LocationDropdownChange event: ', $event)
    this.LocationSelect = $event.valueId
    console.log('LocationSelect: ', this.LocationSelect)
    // this.getChartData()
  }

  CustomerSelect: number [] = []
  CustomerDropdownChange($event){
    console.log('CustomerDropdownChange event: ', $event)
    this.CustomerSelect = $event.valueId
    console.log('CustomerSelect: ', this.CustomerSelect)
    this.getChartData()
  }

  MethodSelect: number [] = []
  MethodDropdownChange($event){
    console.log('MethodDropdownChange event: ', $event)
    this.MethodSelect = $event.valueId
    console.log('MethodSelect: ', this.MethodSelect)
    this.getChartData()
  }

  getChartData(){
    const chartData = {
      Location: this.LocationSelect,
      Customer: this.CustomerSelect,
      Method: this.MethodSelect
    }

    this.chartServices.majorChart(chartData).subscribe( (data) => {
      console.log("chart data: ", data)
    }, (error) => {
      console.log("chart error: ", error)
    })
  }

  reset(){
    this.LocationCtrl.reset()
    this.CustomerCtrl.reset()
    this.MethodCtrl.reset()
    this.LocationSelect = []
    this.CustomerSelect = []
    this.MethodSelect = []
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
