import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { loggedUserService } from 'src/app/Services/loggedUser.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent {
  readonly APIUrl = environment.apiUrl;
  programari: any[];
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: number = 1;

  constructor(private http : HttpClient, private loggedUserService: loggedUserService){}

  ngOnInit(): void {
    this.fetchProgramari();
  }

  fetchProgramari(): void {
    this.http.get<any[]>(`${this.APIUrl}programari/`).subscribe(
      (data: any[]) => {
        this.programari = data;
      },
      (error) => {
        console.error('Error fetching programari:', error);
      }
    );
  }

  deleteProgramare(programareId: number): void {
    if (confirm("Ești sigur că vrei să ștergi această programare?")) {
      const programareDeleted = this.programari.find(programare => programare.ProgramareID === programareId);
      this.http.post(`${this.APIUrl}sendAnulareConfirm/`, programareDeleted).subscribe();
      this.http.delete(`${this.APIUrl}programari/delete/${programareId}/`).subscribe(
        () => {
          this.fetchProgramari();
        },
        (error) => {
          console.error(`Error deleting programare with ID ${programareId}:`, error);
        }
      );
    }
  }

  isFutureDateTime(dateString: string, oraString: string): boolean {
    const programareDateTime = new Date(dateString + 'T' + oraString);
    const currentDateTime = new Date();
    return programareDateTime >= currentDateTime;
  }

  
  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = -this.sortDirection;
    } else {
      this.sortColumn = column;
      this.sortDirection = 1;
    }
  
    this.programari.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
  
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * this.sortDirection;
      } else {
        return (aValue - bValue) * this.sortDirection;
      }
    });
  }

  onLogOut(){
    this.loggedUserService.logout();
  }
}
