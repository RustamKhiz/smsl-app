import { Injectable } from "@angular/core";
import {Report, Filter} from "./interfaces";
import {HttpClient} from '@angular/common/http'
import {from, Observable} from "rxjs";
import {tap} from "rxjs/operators"
import{environment} from "src/environments/environment"
import {SignalService} from "../services/signalR.services"
// import { Report } from "../site-layout/reports/reportsAdd/reports-add/reports-add.component";

@Injectable({
    providedIn: 'root'
})

export class ReportAll {

  constructor(private http: HttpClient){
  }
  test: any
  reportAll(filter: Filter){
    console.log("ReportAll is work!")
    console.log("filter interface: ", filter)
    return this.http.post<any>(`${environment.apiUrl}/api/cwr/loaddata`, filter)
    .pipe(
      tap(({filter})=>{
          console.log('Получение CwrWorks: ', filter)
        }
      )
    )
  }
}
