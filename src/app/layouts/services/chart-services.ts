import { Injectable } from "@angular/core";
import {Report} from "./interfaces";
import {HttpClient} from '@angular/common/http'
import {tap} from "rxjs/operators"
import{environment} from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})

export class ChartSevices {

  constructor(private http: HttpClient){
  }

  majorChartfilter(majorChartData){
    // console.log("configData: ", configData)
    return this.http.post<any>(`${environment.apiUrl}/api/informer/1/filter`, majorChartData)
  }
  majorChartload(){
    // console.log("configData: ", configData)
    return this.http.get(`${environment.apiUrl}/api/informer/1/load`)
  }
}
