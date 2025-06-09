import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { loggedUserService } from 'src/app/Services/loggedUser.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-owner',
  templateUrl: './dashboard-owner.component.html',
  styleUrl: './dashboard-owner.component.scss'
})
export class DashboardOwnerComponent {
  constructor(private http : HttpClient, private loggedUserService: loggedUserService){}
  readonly APIUrl = environment.apiUrl;
  utilizatori: any[];
  servicii: any[];
  showAddServiciuForm: boolean = false;
  newServiciu: any = { Nume: '', Pret: null, Descriere: '' };
  showModifyServiciuForm: boolean = false;
  selectedServiciu: any;
  showModifyUserForm: boolean = false;
  selectedUser: any = {};
  minDateValue: Date = new Date();
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: number = 1;
  searchTerm2: string = '';
  sortColumn2: string = '';
  sortDirection2: number = 1;
  programari: any[];
  totalZileLucruFetched: string[] = [];
  totalSloturiViitorFetched: any[] = [];
  totalConturiInregistrate: number = -1;
  conturiClienti: number = -1;
  conturiAdministratori: number = -1;
  totalProgramari: number = -1;
  programariUrmatoare: number = -1;
  serviciiOferite: number = -1;
  totalZileLucru: number = -1;
  sloturiValabile: number = -1;
  selectedProgramLucruDate: Date;
  selectedProgramLucruPrimaOra: string;
  numarOre: number;
  selectedProgramLucruDelete: Date;
  invalidDates: Date[] = [];
  fetchedValidDates: string[] = [];

  deleteZiLucru() {
    const zi = this.formatDate(this.selectedProgramLucruDelete); // Formatăm data în formatul dorit

    this.http.delete(`${this.APIUrl}programlucru/delete/${zi}/`).subscribe(
      () => {
        alert('Înregistrările pentru data specificată au fost șterse cu succes.');
        this.http.delete(`${this.APIUrl}programari/deleteAllProgramari/${zi}/`).subscribe()
        window.location.reload();
      },
      (error) => {
        alert('Eroare la ștergere');
        // Aici poți trata erorile în cazul în care ștergerea nu a fost posibilă
      }
    );
  }

  toggleModifyUserForm(user: any): void {
    this.showModifyUserForm = true;
    this.selectedUser = { ...user };
  }

  toggleModifyServiciuForm(serviciu: any): void {
    this.selectedServiciu = { ...serviciu };
    this.showModifyServiciuForm = !this.showModifyServiciuForm;
    this.showModifyServiciuForm = true;
    this.showAddServiciuForm = false; 
  }

  toggleAddServiciuForm(): void {
    this.showAddServiciuForm = !this.showAddServiciuForm;
    this.newServiciu = { Nume: '', Pret: null, Descriere: '' };
    this.showModifyServiciuForm = false;
    this.showAddServiciuForm = true;
  }

  modifyUser(): void {
    delete this.selectedUser.Parola;
    this.http.put(`${this.APIUrl}authentication/modifyuser/${this.selectedUser.UserID}/`, this.selectedUser).subscribe(
      () => {
        this.showModifyUserForm = false;
        this.fetchUtilizatori();
      },
      (error) => {
        console.error('Error modifying user:', error);
      }
    );
  }

  modifyServiciu(): void {
    this.http.put(`${this.APIUrl}modify_serviciu/${this.selectedServiciu.ServiciuID}/`, this.selectedServiciu).subscribe(
      () => {
        this.fetchServicii();
        this.showModifyServiciuForm = false;
      },
      (error) => {
        console.error('Error modifying serviciu:', error);
      }
    );
  }

  addServiciu(): void {
    this.http.post(`${this.APIUrl}add_serviciu/`, this.newServiciu).subscribe(
      () => {
        this.fetchServicii();
        this.showAddServiciuForm = false;
        this.newServiciu = { Nume: '', Pret: null, Descriere: '' };
      },
      (error) => {
        console.error('Error adding serviciu:', error);
      }
    );
  }


  
  ngOnInit(): void {
    this.fetchUtilizatori();
    this.fetchServicii();
    this.fetchProgramari();
    setTimeout(() => { this.calculeazaStatistici(); }, 100);
    setTimeout(() => { this.initializeInvalidDates(); }, 150);
    this.fetchProgramLucruDates();
  }

  fetchProgramLucruDates(): void {
    this.http.get<any[]>(`${this.APIUrl}programlucru/`).subscribe(
      (data: any[]) => {
        this.fetchedValidDates = data.map((item: any) => item.Zi);
        this.totalZileLucruFetched = data.map((item: any) => item.Zi);
        this.totalSloturiViitorFetched = data.map((item: any) => item.NumarOre);
        
      },
      (error) => {
        console.error('Error fetching ProgramLucru dates:', error);
      }
    );
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

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }


  calculeazaStatistici(){

    const dataCurenta = new Date();

    this.totalConturiInregistrate=this.utilizatori.length;
    this.conturiClienti = this.utilizatori.filter(user => user.Rol === 'Client').length;
    this.conturiAdministratori = this.utilizatori.filter(user => user.Rol === 'Admin').length;
    this.totalProgramari = this.programari.length;
    this.serviciiOferite = this.servicii.length;
    this.programariUrmatoare = this.programari.filter(programare => {const dataProgramare = new Date(programare.Data); return dataProgramare >= dataCurenta; }).length;

    
    this.totalZileLucru = this.totalZileLucruFetched.length;

    this.sloturiValabile = this.totalSloturiViitorFetched.filter((numarOre, index) => {
      const data = new Date(this.totalZileLucruFetched[index]);
      return data > dataCurenta;
    }).reduce((acc, val) => acc + val, 0);

    this.sloturiValabile -= this.totalProgramari;
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
      //const programareDeleted = this.programari.find(programare => programare.ProgramareID === programareId);
      //this.http.post(`${this.APIUrl}sendAnulareConfirm/`, programareDeleted).subscribe();
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

  fetchServicii(): void {
    this.http.get<any[]>(this.APIUrl + 'servicii/').subscribe(
      (data: any[]) => {
        this.servicii = data;
      },
      (error) => {
        console.error('Error fetching servicii:', error);
      }
    );
  }

  deleteServiciu(serviciuId: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.http.delete(`${this.APIUrl}servicii/${serviciuId}/`).subscribe(
        () => {
          this.fetchServicii();
        },
        (error) => {
          console.error(`Error deleting service with ID ${serviciuId}:`, error);
        }
      );
    }
  }


  fetchUtilizatori(): void {
    this.http.get<any[]>(`${this.APIUrl}authentication/getaccounts/`).subscribe(
      (data: any[]) => {
        this.utilizatori = data;
      },
      (error) => {
        console.error('Error fetching utilizatori:', error);
      }
    );
  }

  deleteUser(userId: number): void {
    if (confirm("Are you sure you want to delete this user?")) {
      this.http.delete(`${this.APIUrl}authentication/deleteuser/${userId}/`).subscribe(
        () => {
          this.fetchUtilizatori();
        },
        (error) => {
          console.error(`Error deleting user with ID ${userId}:`, error);
        }
      );
    }
  }

  onLogOut(){
    this.loggedUserService.logout();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }


  submitForm() {
    if (!this.selectedProgramLucruDate || !this.selectedProgramLucruPrimaOra || !this.numarOre) {
      alert("Please fill in all fields.");
      return;
    }

    const programData = {
      Zi: this.formatDate(this.selectedProgramLucruDate),
      PrimaOra: this.selectedProgramLucruPrimaOra,
      NumarOre: this.numarOre
    };
    this.http.post<any>(`${this.APIUrl}programlucru/insert/`, programData).subscribe(
      response => {
        alert('ProgramLucru inserted successfully!');
        window.location.reload();
      },
      error => {
        console.error('Error inserting ProgramLucru:', error);
        alert('Error inserting ProgramLucru. Please try again later.');
      }
    );
  }

  
  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = -this.sortDirection;
    } else {
      this.sortColumn = column;
      this.sortDirection = 1;
    }
  
    this.servicii.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
  
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * this.sortDirection;
      } else {
        return (aValue - bValue) * this.sortDirection;
      }
    });
  }


  
  sortTable2(column: string): void {
    if (this.sortColumn2 === column) {
      this.sortDirection2 = -this.sortDirection2;
    } else {
      this.sortColumn2 = column;
      this.sortDirection2 = 1;
    }
  
    this.utilizatori.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
  
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * this.sortDirection2;
      } else {
        return (aValue - bValue) * this.sortDirection2;
      }
    });
  }
}
