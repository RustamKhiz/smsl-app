import { Injectable } from "@angular/core";
import {User} from "./interfaces";
import {HttpClient} from '@angular/common/http'
import {from, Observable, Subscription} from "rxjs";
import {tap} from "rxjs/operators"
import{environment} from "src/environments/environment"
import {SignalService} from "../services/signalR.services"
import { afterlogServices } from "./afterlog.services";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class AutServices {
    //Объявление переменных для
    private JWT = null
    private UserName = null
    private ConnectionHash = null
    // private Name = null
    // private LastName = null
    // private MidName = null
    private MyPerson: {
      Personal:{
        Id: null
        AccessLevel: null
      }
    }

    aSub: Subscription
    constructor(private http: HttpClient, private signal: SignalService, private afteraut: afterlogServices, private router: Router ){

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
              console.log(localStorage.getItem('Id'))
            }
          )
        )
        .pipe(
          tap(
            () => {
              this.signal.connect();
              this.signal.onConnect.subscribe((c, n) => {
                  console.log(`AutServices ${c} hash ${n} `)
                  localStorage.setItem('ConnectionHash', c)
                  this.aSub = this.afteraut.afterLog().subscribe(
                    (res)=> {
                      console.log("afterlog working!")
                      console.log("dataload: ", res)
                      // Получаем персонал из afterLog
                      const persData = JSON.stringify(this.afteraut.newPersonals)
                      localStorage.setItem('Personal', persData)
                      //Получаем оборудование из afterLog
                      const MashinData = JSON.stringify(this.afteraut.newMashines)
                      localStorage.setItem('Mashines', MashinData)
                      //Получаем заказчиков из afterlog
                      const CustomersData = JSON.stringify(this.afteraut.newCustomers)
                      localStorage.setItem('Customers', CustomersData)
                      //Получаем GeneralLocations из afterlog
                      const GeneralLocationsData = JSON.stringify(this.afteraut.newGeneralLocations)
                      localStorage.setItem('GeneralLocations', GeneralLocationsData)
                      //Получаем Locations из afterlog
                      const LocationsData = JSON.stringify(this.afteraut.newLocactions)
                      localStorage.setItem('Locations', LocationsData)
                  },
                    (error) => {
                      console.log("afterlog dont work")
                      console.log("error:",error)
                    },()=> {
                      console.log("subscribe complite")
                    }
                  )
                }

              );


            }
          )
        )
        .pipe()

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
