// import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import {Observable, throwError} from "rxjs";
// import { AutServices } from "../services/aut.services";
// import {SignalService} from "../services/signalR.services"
// import {catchError} from "rxjs/operators";
// import {Router} from "@angular/router";

// @Injectable()
// export class ErrorInterseptor implements HttpInterceptor {
//   constructor(private autserv: AutServices) {
//   }

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     return next.handle(request).pipe(
//       catchError(err => {
//       if (err.status === 401) {
//         // при получении 401 от api выходим на авторизацию
//         this.autserv.logout();
//         console.log("err.status" + err.status)
//         location.reload();
//       }

//       const error = err.body;
//       return throwError(error);
//     })
//     )
//   }
// }
