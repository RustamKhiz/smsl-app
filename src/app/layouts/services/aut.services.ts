import { Injectable } from "@angular/core";
import { User } from "./interfaces";
import {HttpClient} from '@angular/common/http'
import { Observable } from "rxjs";
import {tap} from "rxjs/operators"
import{environment} from "src/environments/environment"

@Injectable({
    providedIn: 'root'
})

export class AutServices {

    private JWT = null
    private UserName = null
    constructor(private http: HttpClient){

    }

    login(user: User): Observable<{JWT: string, UserName: string}>{

        return this.http.post<{JWT: string,UserName: string }>(`${environment.apiUrl}/api/auth`, user)
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

    }
    // saveUser(user: User): Observable<{ userName: string }>{
    //   return this.http.post<{userName: string}>(`${environment.apiUrl}/api/auth`, user)
    //     .pipe(
    //       tap(
    //         ({userName})=>{
    //           localStorage.setItem('UserName', userName)
    //           this.setUsername(userName)
    //         }
    //       )
    //     )
    // }
    setUsername(UserName: string){
      this.UserName = UserName
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
