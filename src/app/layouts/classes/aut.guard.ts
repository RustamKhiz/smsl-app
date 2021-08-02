import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import {AutServices} from "src/app/layouts/services/aut.services"

@Injectable({
    providedIn: 'root'
})

export class AutGuard implements CanActivate, CanActivateChild{
    constructor(private aut: AutServices, private router: Router){

    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        if (this.aut.isAuthenticated()) {
            return of(true)
        } else {
            this.router.navigate(['/aut'],{
                queryParams: {
                    accessDenied:true
                }
            })
            return of (false)
        }
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        return this.canActivate(route, state)
    }
}
     
