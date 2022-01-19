import { Injectable } from "@angular/core";
import {User} from "./interfaces";
import {HttpClient} from '@angular/common/http'
import {from, Observable, Subscription} from "rxjs";
import {tap} from "rxjs/operators"
import{environment} from "src/environments/environment"
import {SignalService} from "../services/signalR.services"
import { afterlogServices } from "./afterlog.services";
import { Router } from "@angular/router";
import { AppComponent } from "src/app/app.component";

@Injectable({
    providedIn: 'root'
})

export class AutServices {
    //Объявление переменных для
    private JWT = null
    private ConnectionHash = null
    private MyPerson: {
      Personal:{
        Id: null
        AccessLevel: null
      }
    }
    aSub: Subscription
    constructor(private http: HttpClient, private signal: SignalService, private afteraut: afterlogServices, private router: Router){

    }

    login(user: User): Observable<{JWT: string,alluser:string, UserName: string, ConnectionHash:string, MyPerson: {Personal:{Id: string, AccessLevel: null}}}>{
        return this.http.post<{JWT: string,alluser:string, UserName: string, ConnectionHash:string, MyPerson: {Personal:{Id: string, AccessLevel: null}} }>
        (`${environment.apiUrl}/api/auth`, user)
        .pipe(
            tap(
                ({JWT}) => {
                    localStorage.setItem('aut-token', JWT)
                    this.setToken(JWT);
                }
            )
        )
        .pipe(
          tap(
            ({MyPerson: {Personal:{Id}}})=>{
              localStorage.setItem('Id', Id)
              this.setId({MyPerson: {Personal:{Id}}})
            }
          )
        )
    }

    setConnectionHash(ConnectionHash:string){
      this.ConnectionHash = ConnectionHash
    }
    setId({MyPerson: {Personal:{Id}}}){
      this.MyPerson = Id
    }
    setToken(JWT: string){
      this.JWT = JWT
    }

    getToken(): string {
      this.JWT = localStorage.getItem('aut-token')
      return this.JWT
    }
    getId(): string {
      return this.MyPerson.Personal.Id
    }
    isAuthenticated(): boolean {
      return !!this.JWT
    }

    logout(){
        this.setToken(null)
        localStorage.clear()
        this.router.navigate(['/aut'])
    }
}
