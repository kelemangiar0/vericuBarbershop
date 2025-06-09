import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; 
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  readonly APIUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  postUser(userData: any): Observable<any> {
    return this.http.post<any>(this.APIUrl + 'authentication/register/', userData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400 && error.error) {
            return throwError("Email sau telefon duplicat");
          } else {
            return throwError("Eroare la înregistrare. Te rugăm să încerci din nou.");
          }
        })
      );
  }

  // loginUser(userData: any): Observable<any> {
  //   console.log(userData);
  //   return this.http.post<any>(this.APIUrl + 'authentication/login/', userData, { withCredentials: true })
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //         return throwError(error);
  //       })
  //     );
  // }

}
