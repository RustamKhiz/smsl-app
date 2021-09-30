import { Injectable } from "@angular/core";
import {Report} from "./interfaces";
import {HttpClient} from '@angular/common/http'
import {from, Observable} from "rxjs";
import {tap} from "rxjs/operators"
import{environment} from "src/environments/environment"
import {SignalService} from "../services/signalR.services"

@Injectable({
    providedIn: 'root'
})

export class ReportAdd {
    test: any


    constructor(private http: HttpClient){

    }

    reportAdd(report: Report): Observable<{test: any}>{
        return this.http.post<{test: any}>(`${environment.apiUrl}/api/auth`, report)
    }
}