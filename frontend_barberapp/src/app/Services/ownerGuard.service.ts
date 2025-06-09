import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { loggedUserService } from "./loggedUser.service";

@Injectable()
export class OwnerAccountGuard implements CanActivate{

    constructor(private loggedIn: loggedUserService, private router: Router){
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if(this.loggedIn.isUserLoggedIn() && this.loggedIn.getUserRole() == "Owner")
            return true;
        else
        {
            alert("Nu ești autentificat!");       
            this.router.navigateByUrl('/profil').then(() => {
                window.location.reload();
              });
            return false;
        }
    }
}