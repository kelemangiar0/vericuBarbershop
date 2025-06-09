import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class loggedUserService {
    readonly APIUrl = environment.apiUrl;
    public loggedInUser: any = null;
  
    constructor(private router: Router, private http : HttpClient) {
      this.loggedInUser = JSON.parse(localStorage.getItem('loggedUser'));
    }
  
    login() {
      this.http.get(`${this.APIUrl}authentication/user/`, { withCredentials: true }).subscribe(
      (res: any) => {
        this.loggedInUser = res;
        localStorage.setItem('loggedUser', JSON.stringify(this.loggedInUser));
      },
      (err) => {
        console.error('Error fetching user data:', err);
        localStorage.removeItem('loggedUser');
        this.loggedInUser=null;
        
      }
    );
    
    }
  
    logout() {
      this.http.post(`${this.APIUrl}authentication/logout/`,{}, {withCredentials: true}).subscribe();
      localStorage.removeItem('loggedUser');
      this.loggedInUser=null;
      this.router.navigateByUrl('/auth').then(() => {
      window.location.reload();
    });
    }
  
    isUserLoggedIn() {
      return this.loggedInUser !== null;
    }
  
    getUserName() {
      return this.loggedInUser ? this.loggedInUser.NumePrenume : '';
    }
  
    getUserPhone() {
      return this.loggedInUser ? this.loggedInUser.Telefon : '';
    }

    getUserEmail() {
      return this.loggedInUser ? this.loggedInUser.Email : '';
    }

    getUserID() {
      return this.loggedInUser ? this.loggedInUser.UserID : '';
    }
    getUserRole() {
      return this.loggedInUser ? this.loggedInUser.Rol : '';
    }
  }
  