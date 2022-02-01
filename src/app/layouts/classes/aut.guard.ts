import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of, Subscription } from "rxjs";
import {AutServices} from "src/app/layouts/services/aut.services"

@Injectable({
    providedIn: 'root'
})

export class AutGuard implements CanActivate, CanActivateChild{
    constructor(private aut: AutServices, private router: Router,private queryRoute: ActivatedRoute){

    }
    sub: Subscription

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
      // this.sub = this.queryRoute.queryParams.subscribe((params) => {
      //   console.log(params)
      // })
        if (this.aut.isAuthenticated()) {

            return of(true)
        } else  {
          // this.sub = this.queryRoute.queryParams.subscribe((params) => {
              // let id = params['id']

              // if (params['id'] != null){
                // this.router.navigate(['/aut'],{
                //     queryParams: {
                //         link: params['id']
                //     }
                // })
              // }else {
                this.router.navigate(['/aut'],{
                    queryParams: {
                        accessDenied: true,
                        // link: id
                    }
                })
              // }
            // })

            return of (false)
        }
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        return this.canActivate(route, state)
    }
}

// this.sub = this.queryRoute.queryParams.subscribe((params) => {
            //   console.log('params', params)

              // if (params['id'] != null){
              //   this.router.navigate(['/aut'],{
              //       queryParams: {
              //           link: params['id']
              //       }
              //   })
              // }else {
              //   this.router.navigate(['/aut'],{
              //       queryParams: {
              //           accessDenied: true
              //       }
              //   })
              // }
            // })
