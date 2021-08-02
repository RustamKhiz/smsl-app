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

    constructor(private http: HttpClient){

    }

    login(user: User): Observable<{JWT: string}>{
        return this.http.post<{JWT: string}>(`${environment.apiUrl}/api/auth`, user)
        .pipe(
            tap(
                ({JWT}) => {
                    localStorage.setItem('aut-token', JWT)
                    this.setToken(JWT)
                }
            )
        )
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