import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReplaySubject } from 'rxjs';
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

// export class single {
//   constructor(
//               public name: string,
//               public value: number
//   ){}
// }
// export var single = [
//   {
//     name: "Брак (пересветы)",
//     value: 15
//   },
//   {
//     name: "Передано заключений заказчику по актам приёма передачи",
//     value: 120
//   },
//   {
//     name: "Оформлено заключений через ПО",
//     value: 155
//   },
//   {
//     name: "Выполнено по отчётам",
//     value: 264
//   }
// ];

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  // single: any[];
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
    // {
    //   name: "Брак (пересветы)",
    //   value: 150
    // },
    // {
    //   name: "Передано заключений заказчику по актам приёма передачи",
    //   value: 1200
    // },
    // {
    //   name: "Оформлено заключений через ПО",
    //   value: 1550
    // },
    // {
    //   name: "Выполнено по отчётам",
    //   value: 2640
    // }
  ];

  constructor(private chartServices: ChartSevices) {
    // Object.assign(this, { single });
  }

  LocationData: NewDropdown [] = []
  LocationDataMulti: ReplaySubject<NewDropdown[]> = new ReplaySubject<NewDropdown[]>(1);
  location = JSON.parse(localStorage.getItem('Locations')) //Получаем данные все локации
  CustomerData: NewDropdown [] = []
  CustomerDataMulti: ReplaySubject<NewDropdown[]> = new ReplaySubject<NewDropdown[]>(1);
  customer = JSON.parse(localStorage.getItem('Customers')) //Получаем данные всех пользователей
  MethodData: NewDropdown [] = []
  MethodDataMulti: ReplaySubject<NewDropdown[]> = new ReplaySubject<NewDropdown[]>(1);
  method =  JSON.parse(localStorage.getItem('MethodControl'))

  LocationCtrl: FormControl = new FormControl(null)
  CustomerCtrl: FormControl = new FormControl(null)
  MethodCtrl: FormControl = new FormControl(null)

  chartLoadData;

  ngOnInit() {

    this.chartServices.majorChartload().subscribe((data: any) => {
      console.log('chart load seccess: ', data)
      this.chartLoadData = data

      this.loadDropdown()

    }, (err) => {
      console.log('chart load error: ', err)
    })
  //Заполняем объекты с интерфейсом NewDropdown
    // let Id
    // let Name
    // let Display
    // let IsSelect


    // for (let i = 0; i < this.location.length; i++) {
    //   if (this.location[i].Actual == 1){
    //     Id = this.location[i].Id
    //     Name = this.location[i].SmallName
    //     Display = true
    //     IsSelect = true
    //     this.LocationData.push(new NewDropdown(Id, Name, Display, IsSelect))
    //   }
    // }
    // for (let i = 0; i < this.customer.length; i++) {
    //   if (this.customer[i].IsActual == true){
    //     Id = this.customer[i].Id
    //     Name = this.customer[i].SmallName
    //     Display = true
    //     IsSelect = false
    //     this.CustomerData.push(new NewDropdown(Id, Name, Display, IsSelect))
    //   }
    // }
    // for (let i = 0; i < this.method.length; i++) {
    //     Id = this.method[i].Id
    //     Name = this.method[i].Name
    //     Display = true
    //     IsSelect = false
    //     this.MethodData.push(new NewDropdown(Id, Name, Display, IsSelect))
    // }


    this.getChartData()
  }

  loadDropdown(){
    let Id
    let Name
    let Display
    let IsSelect

    for (let i = 0; i < this.chartLoadData?.length; i++) {
      let findId = this.LocationData.find((item) => item.Id == this.chartLoadData[i].SubLocId)
      // console.log('findId', findId)
      if (!findId){
        Id = this.chartLoadData[i].SubLocId
        Name = this.chartLoadData[i].SubLocName
        Display = true
        IsSelect = true
        this.LocationData.push(new NewDropdown(Id, Name, Display, IsSelect))
        this.LocationDataMulti.next(this.LocationData.slice())
      }
    }

    for (let i = 0; i < this.chartLoadData?.length; i++) {
      let findId = this.CustomerData.find((item) => item.Id == this.chartLoadData[i].CustomerId)
      // console.log('findId', findId)
      if (!findId){
        Id = this.chartLoadData[i].CustomerId
        Name = this.chartLoadData[i].CustomerName
        Display = true
        IsSelect = true
        this.CustomerData.push(new NewDropdown(Id, Name, Display, IsSelect))
        this.CustomerDataMulti.next(this.CustomerData.slice())

      }
    }

    for (let i = 0; i < this.chartLoadData?.length; i++) {
      let findId = this.MethodData.find((item) => item.Name == this.chartLoadData[i].Metod)
      // console.log('findId', findId)
      if (!findId){
        Id = this.chartLoadData[i].Id
        Name = this.chartLoadData[i].Metod
        Display = true
        IsSelect = true
        this.MethodData.push(new NewDropdown(Id, Name, Display, IsSelect))
        this.MethodDataMulti.next(this.MethodData.slice())

      }
    }
  }

  LocationSelect: number [] = []

  optiondisable(event, type: string){
    // for (let i = 0; i < this.chartLoadData.length; i++) {
    //   for (let j = 0; j < event.valueId.length; j++) {
    //     if (type == 'location'){
    //       if (this.chartLoadData[i].SubLocId == event.valueId[j] ){
    //         for (let k = 0; k < this.CustomerData.length; k++) {
    //           this.CustomerData[k].Display = false
    //           if (this.CustomerData[k].Id == this.chartLoadData[i].CustomerId){
    //             this.CustomerData[k].Display = true
    //           }
    //         }
    //         for (let k = 0; k < this.MethodData.length; k++) {
    //           this.MethodData[k].Display = false
    //           if (this.MethodData[k].Name == this.chartLoadData[i].Metod){
    //             this.MethodData[k].Display = true
    //           }
    //         }
    //       }
    //     }
    //     if (type == 'customer'){
    //       if (this.chartLoadData[i].CustomerId == event.valueId[j] ){
    //         for (let k = 0; k < this.MethodData.length; k++) {
    //           this.MethodData[k].Display = false
    //           if (this.MethodData[k].Name == this.chartLoadData[i].Metod){
    //             this.MethodData[k].Display = true
    //           }
    //         }
    //         for (let k = 0; k < this.LocationData.length; k++) {
    //           this.LocationData[k].Display = false
    //           if (this.LocationData[k].Id == this.chartLoadData[i].SubLocId){
    //             this.LocationData[k].Display = true
    //           }
    //         }
    //       }
    //     }
    //     if (type == 'method'){
    //       if (this.chartLoadData[i].Name == event.valueName[j] ){
    //         for (let k = 0; k < this.CustomerData.length; k++) {
    //           this.CustomerData[k].Display = false
    //           if (this.CustomerData[k].Id == this.chartLoadData[i].CustomerId){
    //             this.CustomerData[k].Display = true
    //           }
    //         }
    //         for (let k = 0; k < this.LocationData.length; k++) {
    //           this.LocationData[k].Display = false
    //           if (this.LocationData[k].Id == this.chartLoadData[i].SubLocId){
    //             this.LocationData[k].Display = true
    //           }
    //         }
    //       }
    //     }
    //   }
    // }

    // if (type == 'location'){
    //   if (event.valueId.length == 0){
    //     for (let k = 0; k < this.CustomerData.length; k++) {
    //       this.CustomerData[k].Display = true
    //     }
    //     for (let k = 0; k < this.MethodData.length; k++) {
    //       this.MethodData[k].Display = true
    //     }
    //   }
    // }

    // if (type == 'customer'){
    //   if (event.valueId.length == 0){
    //     for (let k = 0; k < this.MethodData.length; k++) {
    //       this.MethodData[k].Display = true
    //     }
    //     for (let k = 0; k < this.LocationData.length; k++) {
    //       this.LocationData[k].Display = true
    //     }
    //   }
    // }

    // if (type == 'method'){
    //   if (event.valueId.length == 0){
    //     for (let k = 0; k < this.LocationData.length; k++) {
    //       this.LocationData[k].Display = true
    //     }
    //     for (let k = 0; k < this.CustomerData.length; k++) {
    //       this.CustomerData[k].Display = true
    //     }
    //   }
    // }

  }

  LocationDropdownChange($event){
    let type = 'location'
    this.optiondisable($event, type)

    console.log('LocationDropdownChange event: ', $event)
    this.LocationSelect = $event.valueId
    console.log('LocationSelect: ', this.LocationSelect)

    console.log('this.CustomerData aft', this.CustomerData)
    for (let k = 0; k < $event.valueId.length; k++) {
      let filterId: any [] = this.chartLoadData.filter((item) => item.SubLocId == $event.valueId[k])
      console.log('filterId', filterId)
      for (let i = 0; i < this.CustomerData.length; i++) {
        let findId = filterId.filter((item) => item.CustomerId == this.CustomerData[i]?.Id)
        console.log('findId', findId)
        if (findId.length == 0){
            this.CustomerData[i].IsSelect = false
        }
      }
      for (let i = 0; i < this.MethodData.length; i++) {
        let findId = filterId.filter((item) => item.Metod == this.MethodData[i]?.Name)
        console.log('findId', findId)
        if (findId.length == 0){
            this.MethodData[i].IsSelect = false
        }
      }
    }

    if ($event.valueId.length == 0){
        for (let j = 0; j < this.CustomerData.length; j++) {
          this.CustomerData[j].IsSelect = true
        }
        for (let j = 0; j < this.MethodData.length; j++) {
          this.MethodData[j].IsSelect = true
        }
    }

    this.getChartData()
    // this.singleData
  }

  CustomerSelect: number [] = []
  CustomerDropdownChange($event){

    let type = 'customer'
    this.optiondisable($event, type)

    console.log('CustomerDropdownChange event: ', $event)
    this.CustomerSelect = $event.valueId
    console.log('CustomerSelect: ', this.CustomerSelect)

    for (let k = 0; k < $event.valueId.length; k++) {
      let filterId: any [] = this.chartLoadData.filter((item) => item.CustomerId == $event.valueId[k])
      console.log('filterId', filterId)
      for (let i = 0; i < this.LocationData.length; i++) {
        let findId = filterId.filter((item) => item.SubLocId == this.LocationData[i]?.Id)
        console.log('findId', findId)
        if (findId.length == 0){
            this.LocationData[i].IsSelect = false
        }
      }
      for (let i = 0; i < this.MethodData.length; i++) {
        let findId = filterId.filter((item) => item.Metod == this.MethodData[i]?.Name)
        console.log('findId', findId)
        if (findId.length == 0){
            this.MethodData[i].IsSelect = false
        }
      }
    }

    if ($event.valueId.length == 0){
        for (let j = 0; j < this.LocationData.length; j++) {
          this.LocationData[j].IsSelect = true
        }
        for (let j = 0; j < this.MethodData.length; j++) {
          this.MethodData[j].IsSelect = true
        }
    }

    this.getChartData()
  }

  MethodSelect: number [] = []
  MethodDropdownChange($event){
    let type = 'method'
    this.optiondisable($event, type)

    console.log('MethodDropdownChange event: ', $event)
    this.MethodSelect = $event.valueName
    console.log('MethodSelect: ', this.MethodSelect)

    for (let k = 0; k < $event.valueName.length; k++) {
      let filterId: any [] = this.chartLoadData.filter((item) => item.Metod == $event.valueName[k])
      console.log('filterId', filterId)
      for (let i = 0; i < this.LocationData.length; i++) {
        let findId = filterId.filter((item) => item.SubLocId == this.LocationData[i]?.Id)
        console.log('findId', findId)
        if (findId.length == 0){
            this.LocationData[i].IsSelect = false
        }
      }
      for (let i = 0; i < this.CustomerData.length; i++) {
        let findId = filterId.filter((item) => item.CustomerId == this.CustomerData[i]?.Id)
        console.log('findId', findId)
        if (findId.length == 0){
            this.CustomerData[i].IsSelect = false
        }
      }
    }

    if ($event.valueId.length == 0){
        for (let j = 0; j < this.LocationData.length; j++) {
          this.LocationData[j].IsSelect = true
        }
        for (let j = 0; j < this.CustomerData.length; j++) {
          this.CustomerData[j].IsSelect = true
        }
    }

    this.getChartData()
  }

  getChartData(){
    const chartData = {
      Locations: this.LocationSelect,
      Customers: this.CustomerSelect,
      Metods: this.MethodSelect
    }
    console.log("chartData obj: ", chartData)
    this.chartServices.majorChartfilter(chartData).subscribe( (data) => {
      console.log("chart data: ", data)
      for (let i = 0; i < data.length; i++) {
        this.singleData[i] = {name: data[i].Name, value: data[i].Count}
      }
      this.singleData = [...this.singleData]

      [this.singleData[0], this.singleData[1], this.singleData[2], this.singleData[3]] = [this.singleData[2], this.singleData[1], this.singleData[0], this.singleData[3]]

      console.log('singleData', this.singleData)
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
    for (let j = 0; j < this.LocationData.length; j++) {
      this.LocationData[j].IsSelect = true
    }
    for (let j = 0; j < this.CustomerData.length; j++) {
      this.CustomerData[j].IsSelect = true
    }
    for (let j = 0; j < this.MethodData.length; j++) {
      this.MethodData[j].IsSelect = true
    }
    this.getChartData()
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
