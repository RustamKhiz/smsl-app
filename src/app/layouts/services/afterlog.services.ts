import { Injectable } from "@angular/core";
import {Personals, User} from "./interfaces";
import {HttpClient} from '@angular/common/http'
import {from, Observable} from "rxjs";
import {map, tap} from "rxjs/operators"
import{environment} from "src/environments/environment"
@Injectable({
  providedIn: 'root'
})
export class afterlogServices{
  public newPersonals: any;
  public newMashines: any;
  constructor(private http: HttpClient) {
  }
  afterLog(): Observable<{Personals:string, Mashines: string}>{
    console.log("qu")
    return this.http.get<{Personals:string, Mashines: string}>(`${environment.apiUrl}/api/baseapp/dataload`)

      .pipe(
        tap(({Personals})=>{
          console.log("первое получение Personals",Personals)
          this.newPersonals = Personals
        }),
        tap(({Mashines})=>{
          console.log("Первое получение Mashines", Mashines)
          this.newMashines = Mashines;
        })
      )

  }

}
