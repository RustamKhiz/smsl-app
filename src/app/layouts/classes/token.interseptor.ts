import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable, OnInit} from "@angular/core";
import {Observable, throwError} from "rxjs";
import { AutServices } from "../services/aut.services";
import {SignalService} from "../services/signalR.services"
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable()

export class TokenInterseptor implements HttpInterceptor , OnInit{
  private SignalHash: string
    constructor(private auth: AutServices, private router: Router, private hash: SignalService){

    }
  ngOnInit() {
    this.SignalHash = "Empty"
    this.hash.onConnect.subscribe((c, n) => {

        console.log(`TokenInterseptor ${c} hash ${n} `);
        this.SignalHash = c;

    }

    );
  }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        if (this.auth.isAuthenticated()){
            req = req.clone({
                setHeaders:{
                    Authorization: 'Bearer ' + this.auth.getToken(),
                    // Trai ler: this.hash.onHash(),
                    SignalHash:this.hash.onHash() //this.hash.onHash("hash")
                }
            })
        }
        return next.handle(req)
          .pipe(
            catchError((error: HttpErrorResponse)=>{
              console.log('[Interseptor Error]: ', error)
              //console.log('[Interseptor Error]: ', error.status)
              if (error.status === 401){
                this.auth.logout()
                this.router.navigate(['/aut'],{
                  queryParams:{
                    authField: true
                  }
                })
              }
                return throwError(error)
            })
          )
    }
}
