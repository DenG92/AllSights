import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { RegionsComponent } from './regions/regions.component';
import { HistoricalRegionsComponent } from './historical-regions/historical-regions.component';
import { AdministrativeRegionsComponent } from './administrative-regions/administrative-regions.component';

import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminRegionsComponent } from './admin/admin-regions/admin-regions.component';
import { AddAdministrativeRegionComponent } from './admin/add-administrative-region/add-administrative-region.component';
import { EditAdministrativeRegionComponent } from './admin/edit-administrative-region/edit-administrative-region.component';

import { ExtraSelectComponent } from './extra-select/extra-select.component';
import { AdminSettlementsComponent } from './admin/admin-settlements/admin-settlements.component';
import { AddSettlementComponent } from './admin/add-settlement/add-settlement.component';
import { EditSettlementComponent } from './admin/edit-settlement/edit-settlement.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    RegionsComponent,
    HistoricalRegionsComponent,
    AdministrativeRegionsComponent,
    AdminComponent,
    DashboardComponent,
    AdminRegionsComponent,
    AddAdministrativeRegionComponent,
    EditAdministrativeRegionComponent,
    ExtraSelectComponent,
    AdminSettlementsComponent,
    AddSettlementComponent,
    EditSettlementComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
