import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AutServices } from "../services/aut.services";

@Injectable()

export class TokenInterseptor implements HttpInterceptor{
    constructor(private auth: AutServices){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        if (this.auth.isAuthenticated()){
            req = req.clone({
                setHeaders:{
                    Authorization: this.auth.getToken()
                }
            })
        }
        return next.handle(req)
    }
}