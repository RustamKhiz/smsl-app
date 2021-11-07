import { Injectable } from "@angular/core";
import {Personals, User} from "./interfaces";
import {HttpClient} from '@angular/common/http'
import {from, Observable} from "rxjs";
import {map, tap} from "rxjs/operators"
import{environment} from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})

export class ReportDel{

  constructor(private http: HttpClient) {
  }
  repDel(Id, report){
    return this.http.post(`${environment.apiUrl}/api/cwr/delreport/id=${Id}`, report)

  }

}
