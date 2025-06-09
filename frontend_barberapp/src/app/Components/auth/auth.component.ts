import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { loggedUserService } from 'src/app/Services/loggedUser.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

export class AuthComponent {
  readonly APIUrl = environment.apiUrl;
  registerForm: FormGroup;
  loginForm: FormGroup;
  constructor(private router: Router, private authService: AuthenticationService, private formBuilder: FormBuilder, private http: HttpClient, private loggedUser : loggedUserService){}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      NumePrenume: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Telefon: ['', Validators.required],
      Parola: ['', [Validators.required]],
      confirmaParola: ['', Validators.required],
      checkboxRegister: [false, Validators.requiredTrue]
    });

    this.loginForm = this.formBuilder.group({
      Email: ['', Validators.required],
      Parola: ['', [Validators.required]],
      checkboxLogin: [false]
    })
  }

 
  onLogin() {
    if (this.loginForm.invalid) {
      alert("Te rugăm să completezi toate câmpurile.");
      return;
    }
  
    const userData = {
      Email: this.loginForm.value.Email,
      Parola: this.loginForm.value.Parola
    };
  
    this.http.post(`${this.APIUrl}authentication/login/`, userData, { withCredentials: true }).subscribe(
      () => {
        this.loggedUser.login();
        this.router.navigateByUrl('/home').then(() => {
          this.http.get(`${this.APIUrl}authentication/user/`, { withCredentials: true }).subscribe(
            () => {
              setTimeout(() => {window.location.reload();}, 50);
            },
            (error) => {
              console.error('Error fetching user data:', error);
            }
          );
        });
      },
      (error) => {
        if (error.status === 401) {
          alert("Date de autentificare incorecte.");
        } else {
          console.error('Error logging in:', error);
        }
      }
    );
  }

  onRegister() {
    if (this.registerForm.invalid) {
      alert("Te rugăm să completezi toate câmpurile.");
      return;
    }
  
    if (this.registerForm.value.Parola !== this.registerForm.value.confirmaParola) {
      alert("Parola și confirmarea parolei nu se potrivesc.");
      return;
    }
  
    const userData = {
      NumePrenume: this.registerForm.value.NumePrenume,
      Email: this.registerForm.value.Email,
      Telefon: this.registerForm.value.Telefon,
      Parola: this.registerForm.value.Parola,
    };
  
    this.authService.postUser(userData).subscribe(
      () => {
        alert('Înregistrat cu succes!');
        this.router.navigateByUrl('/home');
      },
      error => {
        alert('Eroare la înregistrare. Te rugăm să încerci din nou.' + error);
      }
    );
  }
  
}