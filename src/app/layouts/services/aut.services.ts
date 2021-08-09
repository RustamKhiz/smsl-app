import { Injectable } from "@angular/core";
import { User } from "./interfaces";
import {HttpClient} from '@angular/common/http'
import {from, Observable} from "rxjs";
import {tap} from "rxjs/operators"
import{environment} from "src/environments/environment"

@Injectable({
    providedIn: 'root'
})

export class AutServices {
    //Объявление переменных для
    private JWT = null
    private UserName = null
    private Name = null
    private LastName = null
    private MidName = null
    constructor(private http: HttpClient){

    }

    login(user: User): Observable<{JWT: string, UserName: string, Name: string, LastName: string, MidName: string}>{

        return this.http.post<{JWT: string, UserName: string, Name: string, LastName: string, MidName: string }>(`${environment.apiUrl}/api/auth`, user)
        .pipe(
            tap(
                ({JWT}) => {
                    localStorage.setItem('aut-token', JWT)
                    this.setToken(JWT)
                }
            )
        )
          .pipe(
            tap(
              ({UserName})=>{
                localStorage.setItem('UserName', UserName)
                this.setUsername(UserName)
              }
            )
          )
          .pipe(
            tap(
              ({Name})=>{
                localStorage.setItem('Name', Name)
                this.setName(Name)
              }
            )
          )
          .pipe(
            tap(
              ({LastName})=>{
                localStorage.setItem('LastName', LastName)
                this.setLastName(LastName)
              }
            )
          )
          .pipe(
            tap(
              ({MidName})=>{
                localStorage.setItem('MidName', MidName)
                this.setMidName(MidName)
              }
            )
          )
    }
    setUsername(UserName: string){
      this.UserName = UserName
    }
    setName(Name: string){
      this.Name = Name
    }
    setLastName(LastName: string){
      this.LastName = LastName
    }
    setMidName(MidName: string){
      this.MidName = MidName
    }
    setToken(JWT: string){
        this.JWT = JWT
    }
    getToken(): string {
        return this.JWT
    }

    isAuthenticated(): boolean {
        return !!this.JWT
    }

    logout(){
        this.setToken(null)
        localStorage.clear()
    }
}
