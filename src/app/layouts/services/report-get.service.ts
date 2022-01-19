import { Injectable } from "@angular/core";
import {Personals, User} from "./interfaces";
import {HttpClient} from '@angular/common/http'
import {from, Observable} from "rxjs";
import {map, tap} from "rxjs/operators"
import{environment} from "src/environments/environment"
// import { Report } from "../site-layout/reports/reportsAdd/reports-add/reports-add.component";

@Injectable({
  providedIn: 'root'
})
export class ReportGet{
  public newPersonals: any;

  constructor(private http: HttpClient) {
  }
  repGet(Id): Observable<{}>{
    return this.http.get<{}>(`${environment.apiUrl}/api/cwr/getreport/id=${Id}`)
  }
  repGetNearby(Id){
    return this.http.get(`${environment.apiUrl}/api/cwr/getreport?id=${Id}&nearby=true`)
  }

}
