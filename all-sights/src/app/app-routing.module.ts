import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { RegionsComponent } from './regions/regions.component';
import { HistoricalRegionsComponent } from './historical-regions/historical-regions.component';
import { AdministrativeRegionsComponent } from './administrative-regions/administrative-regions.component';

import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminRegionsComponent } from './admin/admin-regions/admin-regions.component';
import { AddAdministrativeRegionComponent } from './admin/add-administrative-region/add-administrative-region.component';
import { EditAdministrativeRegionComponent } from './admin/edit-administrative-region/edit-administrative-region.component';
import { AdminSettlementsComponent } from './admin/admin-settlements/admin-settlements.component';
import { AddSettlementComponent } from './admin/add-settlement/add-settlement.component';
import { EditSettlementComponent } from './admin/edit-settlement/edit-settlement.component';


const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      {
        path: 'regions',
        children: [
          {
            path: '',
            component: RegionsComponent,
          },
          {
            path: 'historical',
            component: HistoricalRegionsComponent
          },
          {
            path: 'administrative',
            children: [
              {
                path: '',
                component: AdministrativeRegionsComponent
              },
              {
                path: 'former',
                component: AdministrativeRegionsComponent
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'regions',
        component: AdminRegionsComponent
      },
      {
        path: 'regions/add',
        component: AddAdministrativeRegionComponent
      },
      {
        path: 'regions/:id',
        component: EditAdministrativeRegionComponent
      },
      {
        path: 'settlements',
        component: AdminSettlementsComponent
      },
      {
        path: 'settlements/add',
        component: AddSettlementComponent
      },
      {
        path: 'settlements/:id',
        component: EditSettlementComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
