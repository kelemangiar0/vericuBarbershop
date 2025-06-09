import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { loggedUserService } from 'src/app/Services/loggedUser.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-undenegasesti',
  templateUrl: './undenegasesti.component.html',
  styleUrls: ['./undenegasesti.component.scss']
})
export class UndenegasestiComponent {
  readonly APIUrl = environment.apiUrl;
  nume:string="";
  email:string="";
  telefon:string="";
  mesaj:string="";
  center: google.maps.LatLngLiteral = {lat: 44.40985,lng: 26.082};
  locatie: google.maps.LatLngLiteral ={lat: 44.40985,lng: 26.082};
  zoom = 16;
  mapHeight: string;
  mapWidth: string;

  constructor(private router: Router, public userService: loggedUserService,private http: HttpClient) {
    this.calculateMapSize();
    if (this.userService.isUserLoggedIn()) {
      this.nume = this.userService.getUserName();
      this.email = this.userService.getUserEmail();
      this.telefon = this.userService.getUserPhone();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateMapSize();
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.center = event.latLng.toJSON();
    }
  }

  calculateMapSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const minDimension = Math.min(windowWidth, windowHeight);
    this.mapHeight = `${minDimension}px`;
    this.mapWidth = `${minDimension}px`;
  }

  sendMessage(){
    if(!this.nume || !this.email || !this.telefon || !this.mesaj)
    {
      alert("Vă rugăm completați toate câmpurile!");
    }
    else
    {
      const data = {
        Nume: this.nume,
        Email: this.email,
        Telefon: this.telefon,
        Mesaj: this.mesaj
      };

      this.http.post<any>(`${this.APIUrl}sendContactEmail/`, data).subscribe(
        response => {
          console.log('Response from Django:', response);
          alert('Am primit formularul!');
          this.router.navigateByUrl('/home');
        },
        error => {
          console.error('Error sending email:', error);
          alert('An error occurred while sending email.');
        }
      );
    }
  }
}
