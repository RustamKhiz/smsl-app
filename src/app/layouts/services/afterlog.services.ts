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
  public newCustomers: any;
  public newGeneralLocations: any
  public newLocactions: any
  public config: any
  constructor(private http: HttpClient) {
  }
  afterLog(): Observable<{Personals:string, Mashines: string, Customers: string, GeneralLocations: string, Locactions: string, AngularUserProps: string}>{
    return this.http.get<{Personals:string, Mashines: string, Customers: string, GeneralLocations: string, Locactions: string, AngularUserProps: string}>(`${environment.apiUrl}/api/baseapp/dataload`)

      .pipe(
        tap(({Personals})=>{
          // console.log("первое получение Personals",Personals)
          this.newPersonals = Personals;
        }),
        tap(({Mashines})=>{
          // console.log("Первое получение Mashines", Mashines)
          this.newMashines = Mashines;
        }),
        tap(({Customers})=>{
          // console.log("Первое получение Customers", Customers)
          this.newCustomers = Customers;
        }),
        tap(({GeneralLocations})=>{
          // console.log("Первое получение GeneralLocations", GeneralLocations)
          this.newGeneralLocations = GeneralLocations;
        }),
        tap(({Locactions})=>{
          // console.log("Первое получение Locactions", Locactions)
          this.newLocactions = Locactions
        }),
        tap(({AngularUserProps}) => {
          this.config = AngularUserProps
        })
      )

  }

}
