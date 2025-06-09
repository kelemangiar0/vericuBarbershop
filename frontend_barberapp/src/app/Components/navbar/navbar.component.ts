
import { Component, HostListener, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { loggedUserService } from 'src/app/Services/loggedUser.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

@Injectable()
export class NavbarComponent{

  loggedUser: any;
  isThereLoggedUser: boolean = false;
  activateGoTop: boolean = false;

  constructor(private log: loggedUserService, private router: Router){
    
    const localUser=localStorage.getItem('loggedUser');
    if(localUser!=null)
    {
      this.loggedUser = JSON.parse(localUser);
      this.isThereLoggedUser = this.log.isUserLoggedIn();
      
    }
  }


  toDespre(){
    this.router.navigateByUrl('/despre');
  }
  toContact(){
    this.router.navigateByUrl('/contact');
  }

  toGalerie(){
    this.router.navigateByUrl('/galerie');
  }
  toAuth(){
    this.router.navigateByUrl('/auth');
  }
  toProgram(){
    this.router.navigateByUrl('/programeaza-te');
  }
  toHome(){
    this.router.navigateByUrl('/home');
  }

  toProfile(){
    
    if(this.log.getUserRole() == "Admin")
    {
      this.router.navigateByUrl('/admin');
    }
    else if(this.log.getUserRole() == "Owner")
    {
      this.router.navigateByUrl('/owner');
    }
    else
      this.router.navigateByUrl('/profil');
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 60) {
      this.activateGoTop = true;
    } else {
      this.activateGoTop = false;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  
}
