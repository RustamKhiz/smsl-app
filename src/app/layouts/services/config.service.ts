import { Injectable } from "@angular/core";
import {Report} from "./interfaces";
import {HttpClient} from '@angular/common/http'
import {tap} from "rxjs/operators"
import{environment} from "src/environments/environment"

@Injectable({
    providedIn: 'root'
})

export class ConfigServ {

  constructor(private http: HttpClient){
  }
  ConfigPost(configData){
    console.log("configData: ", configData)
    return this.http.post<any>(`${environment.apiUrl}/api/baseapp/userprop`, configData)
  }
}
