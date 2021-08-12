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
      }
    }
    constructor(private http: HttpClient){

    }

    login(user: User): Observable<{JWT: string, UserName: string, MyPerson: {Personal:{ Name: string, LastName: string, MidName: string, Telephone: string, Position: string}}}>{

        return this.http.post<{JWT: string, UserName: string, MyPerson: {Personal:{ Name: string, LastName: string, MidName: string, Telephone: string, Position: string}} }>
        (`${environment.apiUrl}/api/auth`, user)
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

    isAuthenticated(): boolean {
        return !!this.JWT
    }

    logout(){
        this.setToken(null)
        localStorage.clear()
    }
}
