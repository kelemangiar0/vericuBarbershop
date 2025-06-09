import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { loggedUserService } from 'src/app/Services/loggedUser.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent {
  readonly APIUrl = environment.apiUrl;
  selectedDate: Date;
  minDateValue: Date = new Date(); 
  maxDateValue: Date;
  selectedHour: string;
  selectedService: string;
  numePrenume: string = "";
  telefon: string = "";
  availableServices: string[] = [];
  invalidDates: Date[] = [];
  fetchedValidDates: string[] = [];
  availableHours: string[] = ['Nu mai sunt locuri!'];
  
  constructor(public userService: loggedUserService, private router: Router, private http: HttpClient) { 

    if (this.userService.isUserLoggedIn()) {
      this.numePrenume = this.userService.getUserName();
      this.telefon = this.userService.getUserPhone();
    }

    const serviceSelected = localStorage.getItem('selectedService');
    if (serviceSelected) {
     
      this.selectedService = JSON.parse(serviceSelected);
      localStorage.removeItem('selectedService');
  }

  setTimeout(() => { this.fetchProgramLucruDates(); }, 200);
    setTimeout(() => { this.initializeInvalidDates(); }, 400);
    //setTimeout(() => { this.calculateMaxDateValue(); }, 100);
    setTimeout(() => { this.fetchServices(); }, 100);
    
  }

  calculateMaxDateValue() {
    const currentDate = new Date();
    this.maxDateValue = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000));
  }

  fetchProgramLucruDates(): void {
    this.http.get<any[]>(`${this.APIUrl}programlucru/`).subscribe(
      (data: any[]) => {
        this.fetchedValidDates = data.map((item: any) => item.Zi);
      },
      (error) => {
        console.error('Error fetching ProgramLucru dates:', error);
      }
    );
  }

  fetchWorkingHours() {
    const formattedDate = this.formatDate(this.selectedDate);
    const currentDate = new Date();
    
    this.http.get<any>(`${this.APIUrl}get-working-hours/?date=${formattedDate}`).subscribe(
      (response: any) => {
        if (response && response.non_reserved_hours && response.non_reserved_hours.length > 0) {
          const currentHour = currentDate.getHours();
          const currentMinute = currentDate.getMinutes();
          const currentTimeString = `${currentHour}:${currentMinute < 10 ? '0' + currentMinute : currentMinute}`;
          
          this.availableHours = response.non_reserved_hours
            .filter((hour: string) => {
              const hourString = hour.slice(0, 5);
              return !(formattedDate === this.formatDate(currentDate) && this.compareTimes(hourString, currentTimeString) <= 0);
            })
            .map((hour: string) => hour.slice(0, 5));
        
        } else {
          console.error('No data available for the selected date.');
        }
      },
      (error) => {
        console.error('Error fetching data for the selected date:', error);
      }
    );
  }
  
  compareTimes(time1: string, time2: string): number {
    const [hour1, minute1] = time1.split(':').map(Number);
    const [hour2, minute2] = time2.split(':').map(Number);
  
    if (hour1 === hour2) {
      return minute1 - minute2;
    } else {
      return hour1 - hour2;
    }
  }

  onDateSelect(event: any) {
    this.selectedHour = null;
    if (this.selectedDate) {
      this.fetchWorkingHours();
    }
  }

  initializeInvalidDates() {
    const currentDate = new Date();
    for (let i = 0; i < 35; i++) {
      const date = new Date(currentDate.getTime());
      date.setDate(date.getDate() + i);
      this.invalidDates.push(date);
    }

    this.removeValidDates();
  }

  removeValidDates() {
    this.fetchedValidDates.forEach(dateString => {
      const parts = dateString.split('-');
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);
      const dateToRemove = new Date(year, month, day);
      const index = this.invalidDates.findIndex(date => this.isSameDate(date, dateToRemove));
      if (index !== -1) {
        this.invalidDates.splice(index, 1);
      }
    });
  }

  onSubmit() {
    if (!this.selectedService || !this.selectedDate || !this.selectedHour || !this.numePrenume || !this.telefon) {
      alert("Te rugăm să completezi toate câmpurile.");
      return;
    }
  
    const formattedDate = this.formatDate(this.selectedDate);
  
    const programareData: any = {
      NumeUser: this.numePrenume,
      Telefon: this.telefon,
      Serviciu: this.selectedService,
      Data: formattedDate,
      Ora: this.selectedHour
    };
    
    if (this.userService.isUserLoggedIn()) {
      programareData.UserID = this.userService.getUserID();
    }
  
    this.http.post<any>(`${this.APIUrl}programari/faprogramare/`, programareData).subscribe();
    this.http.post<any>(`${this.APIUrl}sendConfirmProgramare/`, programareData).subscribe();
    this.router.navigateByUrl('/home');
  }



  toServicii() {
    this.router.navigateByUrl('/servicii');
  }

  fetchServices(): void {
    this.http.get<any[]>(`${this.APIUrl}servicii/`).subscribe(
      (data: any[]) => {
        this.availableServices = data.map((item: any) => item.Nume);
      },
      (error) => {
        console.error('Error fetching services:', error);
      }
    );
  }

  isDateDisabled(date: Date): boolean {
    const formattedDate = this.formatDate(date);
    return !this.fetchedValidDates.includes(formattedDate);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}
