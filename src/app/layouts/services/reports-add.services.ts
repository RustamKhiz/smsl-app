import { Injectable } from "@angular/core";
// import {Report} from "./interfaces";
import {HttpClient} from '@angular/common/http'
import {from, Observable} from "rxjs";
import {tap} from "rxjs/operators"
import{environment} from "src/environments/environment"
import {SignalService} from "../services/signalR.services"
import { Report } from "../site-layout/reports/reportsAdd/reports-add/reports-add.component";

@Injectable({
    providedIn: 'root'
})

export class ReportAdd {



  constructor(private http: HttpClient){

  }

  reportAdd(report: Report): Observable<{CwrWorks: string}>{
    console.log("ReportAdd is work!")
    return this.http.post<{CwrWorks: string}>(`${environment.apiUrl}/api/cwr/addreport`, report)
    .pipe(
      tap(({CwrWorks})=>{
          console.log('Получение CwrWorks: ', CwrWorks)
        }
      )
    )
  }
}
