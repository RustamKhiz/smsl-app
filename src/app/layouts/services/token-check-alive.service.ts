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
export class TokenCheckAlive{
  public newPersonals: any;

  constructor(private http: HttpClient) {
  }
  tokenCheck(token){
    return this.http.get(`${environment.apiUrl}/api/auth/check?token=${token}`)
  }

}
