import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { loggedUserService } from 'src/app/Services/loggedUser.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

@Injectable()
export class DashboardComponent implements OnInit {
  readonly APIUrl = environment.apiUrl;
  loggedInUser: any;
  showModifyNumeForm: boolean = false;
  showModifyEmailForm: boolean = false;
  showModifyTelefonForm: boolean = false;
  showModifyPasswordForm: boolean = false;
  modifiedSomething: boolean = false;
  programariData: any[];
  
  constructor(private http : HttpClient, private loggedUserService: loggedUserService,private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    this.loggedInUser = this.loggedUserService.loggedInUser;
    this.getProgramariForLoggedInUser();
  }

  onLogOut(){
    this.loggedUserService.logout();
  }

  toggleModifyPasswordForm(): void {
    this.showModifyPasswordForm = true;
    this.showModifyNumeForm=false;
    this.showModifyEmailForm=false;
    this.showModifyTelefonForm=false;
    if(!this.modifiedSomething)
      this.modifiedSomething=true;
  }

  toggleModifyNumeForm(): void {
    this.showModifyNumeForm = true;
    this.showModifyPasswordForm = false;
    this.showModifyEmailForm=false;
    this.showModifyTelefonForm=false;
    if(!this.modifiedSomething)
      this.modifiedSomething=true;
  }

  toggleModifyEmailForm(): void {
    this.showModifyEmailForm = true;
    this.showModifyPasswordForm = false;
    this.showModifyNumeForm=false;
    this.showModifyTelefonForm=false;
    if(!this.modifiedSomething)
      this.modifiedSomething=true;
  }

  toggleModifyTelefonForm(): void {
    this.showModifyTelefonForm = true;
    this.showModifyPasswordForm = false;
    this.showModifyNumeForm=false;
    this.showModifyEmailForm=false;
    if(!this.modifiedSomething)
      this.modifiedSomething=true;
  }

  modifyUserDetails(): void {
    if (!this.showModifyPasswordForm) {
      delete this.loggedInUser.Parola;
    }
    this.http.put(`${this.APIUrl}authentication/modifyuser/${this.loggedInUser.UserID}/`, this.loggedInUser).subscribe(
      () => {
        //this.loggedUserService.logout();
        this.loggedUserService.login();
        window.location.reload();
      },
      (error) => {
        console.error('Error modifying user details:', error);
      }
    );
  }





  getProgramariForLoggedInUser(): void {
    const userId = this.loggedUserService.loggedInUser.UserID;
    if (userId) {
      this.http.get<any[]>(`${this.APIUrl}programari/user/${userId}/`).subscribe(
        (data: any[]) => {
          this.programariData = data;
        },
        (error) => {
          console.error('Error fetching programari data:', error);
        }
      );
    }
  }
  isFutureDateTime(dateString: string, oraString: string): boolean {
    const programareDateTime = new Date(dateString + 'T' + oraString);
    const currentDateTime = new Date();
    return programareDateTime >= currentDateTime;
  }
  cancelProgramare(programareId: number): void {
    if (confirm('Ești sigur că vrei să anulezi această programare?')) {
      const programareDeleted = this.programariData.find(programare => programare.ProgramareID === programareId);
      this.http.post(`${this.APIUrl}sendAnulareConfirm/`, programareDeleted).subscribe();
      this.http.delete(`${this.APIUrl}programari/delete/${programareId}/`).subscribe(
        () => {
          this.programariData = this.programariData.filter(programare => programare.ProgramareID !== programareId);
        },
        (error) => {
          console.error('Eroare la anularea programării:', error);
        }
      );
    }
  }

}
