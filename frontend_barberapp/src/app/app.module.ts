import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

// MDB Modules
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import {MatRippleModule} from '@angular/material/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestComponent } from './Components/test/test.component';
import { FooterComponent } from './Components/footer/footer.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { HomeComponent } from './Components/home/home.component';
import { GalerieComponent } from './Components/galerie/galerie.component';
import { DespreComponent } from './Components/despre/despre.component';
import { ServiciiComponent } from './Components/servicii/servicii.component';
import { AuthComponent } from './Components/auth/auth.component';
import { RouterModule, Routes } from '@angular/router';
import { ProgramComponent } from './Components/program/program.component';
import { PagenotfoundComponent } from './Components/pagenotfound/pagenotfound.component';
import {MatDialogModule} from '@angular/material/dialog';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { KnobModule } from 'primeng/knob';
import { DataViewModule } from 'primeng/dataview';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AccountGuard } from './Services/clientGuard.service';
import { loggedUserService } from './Services/loggedUser.service';
import { UndenegasestiComponent } from './Components/undenegasesti/undenegasesti.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { DropdownModule } from 'primeng/dropdown';
import { DashboardAdminComponent } from './Components/dashboard-admin/dashboard-admin.component';
import { AdminAccountGuard } from './Services/adminGuard.service';
import { DashboardOwnerComponent } from './Components/dashboard-owner/dashboard-owner.component';
import { OwnerAccountGuard } from './Services/ownerGuard.service';


const appRoute: Routes = [
  {path: '', redirectTo:'home',pathMatch:'full'},
  {path: 'test', component: TestComponent},
  {path: 'home', component: HomeComponent},
  {path: 'servicii', component: ServiciiComponent},
  {path: 'galerie', component: GalerieComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'despre', component: DespreComponent},
  {path: 'contact', component: UndenegasestiComponent},
  {path: 'programeaza-te', component: ProgramComponent},
  {path: 'profil', component: DashboardComponent, canActivate: [AccountGuard]},
  {path: 'admin', component: DashboardAdminComponent, canActivate: [AdminAccountGuard]},
  {path: 'owner', component: DashboardOwnerComponent, canActivate: [OwnerAccountGuard] },
  {path: '**', component: PagenotfoundComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    GalerieComponent,
    DespreComponent,
    ServiciiComponent,
    AuthComponent,
    ProgramComponent,
    PagenotfoundComponent,
    DashboardComponent,
    UndenegasestiComponent,
    DashboardAdminComponent,
    DashboardOwnerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    MatSlideToggleModule,
    MatRippleModule,
    CalendarModule,
    FormsModule,
    RatingModule,
    KnobModule,
    DataViewModule,
    BrowserModule,
  GoogleMapsModule,
  ReactiveFormsModule,
  DropdownModule,
  HttpClientModule, 
  MatDialogModule,
    RouterModule.forRoot(appRoute)
  ],
  providers: [AccountGuard, loggedUserService, AdminAccountGuard, OwnerAccountGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
