import { Injectable } from "@angular/core";
import {User} from "./interfaces";
import {HttpClient} from '@angular/common/http'
import {from, Observable} from "rxjs";
import {tap} from "rxjs/operators"
import{environment} from "src/environments/environment"
import {SignalService} from "../services/signalR.services"

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
        Name: null
        LastName: null
        MidName: null
        Telephone: null
        Position: null
        Id: null
      }
    }


    constructor(private http: HttpClient, private signal: SignalService){

    }

    login(user: User): Observable<{JWT: string,alluser:string, UserName: string, ConnectionHash:string, MyPerson: {Personal:{ Name: string, LastName: string, MidName: string, Telephone: string, Position: string, Id: string}}}>{

        return this.http.post<{JWT: string,alluser:string, UserName: string, ConnectionHash:string, MyPerson: {Personal:{ Name: string, LastName: string, MidName: string, Telephone: string, Position: string, Id: string}} }>
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

        ))
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
              ({MyPerson: {Personal:{Name}}})=>{
                localStorage.setItem('Name', Name)
                this.setName({MyPerson: {Personal:{Name}}})
              }
            )
           )
          .pipe(
            tap(
              ({MyPerson: {Personal:{LastName}}})=>{
                localStorage.setItem('LastName', LastName)
                this.setLastName({MyPerson: {Personal:{LastName}}})
              }
            )
          )
          .pipe(
            tap(
              ({MyPerson: {Personal:{MidName}}})=>{
                localStorage.setItem('MidName', MidName)
                this.setMidName({MyPerson: {Personal:{MidName}}})
              }
            )
          )
          .pipe(
            tap(
              ({MyPerson: {Personal:{Telephone}}})=>{
                localStorage.setItem('Telephone', Telephone)
                this.setTelephone({MyPerson: {Personal:{Telephone}}})
              }
            )
          )
          .pipe(
            tap(
              ({MyPerson: {Personal:{Position}}})=>{
                localStorage.setItem('Position', Position)
                this.setPosition({MyPerson: {Personal:{Position}}})
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
    setUsername(UserName: string){
      this.UserName = UserName
    }
    setName({MyPerson: {Personal:{Name}}}){
      this.MyPerson = Name
    }
    setLastName({MyPerson: {Personal:{LastName}}}){
      this.MyPerson = LastName
    }
    setMidName({MyPerson: {Personal:{MidName}}}){
      this.MyPerson = MidName
    }
    setTelephone({MyPerson: {Personal:{Telephone}}}){
      this.MyPerson = Telephone
    }
    setPosition({MyPerson: {Personal:{Position}}}){
      this.MyPerson = Position
    }
    setToken(JWT: string){
      this.JWT = JWT
    }

    getToken(): string {
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
    }
}
