import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdministrativeRegion } from '../../_helpers/models/region';

import { ApiService } from '../../_helpers/services/api.service';

@Component({
  selector: 'app-admin-regions',
  templateUrl: './admin-regions.component.html',
  styleUrls: ['./admin-regions.component.scss']
})
export class AdminRegionsComponent implements OnInit {

  public language: string;
  public regions: AdministrativeRegion[];

  constructor(private router: Router, private api: ApiService) {
    this.language = 'ua';
    this.regions = [];
  }

  ngOnInit() {
    this.getRegions();
  }

  getRegions() {
    this.api
      .getData<AdministrativeRegion[]>('regions/administrative', null, AdministrativeRegion)
      .subscribe((regions: AdministrativeRegion[]) => this.regions = regions);
  }

  add() {
    this.router.navigateByUrl(`/admin/regions/add`).then();
  }

  edit(id) {
    this.router.navigateByUrl(`/admin/regions/${id}`).then();
  }

  delete(id) {
    this.api
      .deleteData<AdministrativeRegion>(`regions/administrative/${id}`)
      .subscribe((region: AdministrativeRegion) => {
        // tslint:disable:no-console
        console.info('Deleted region: ', region);
        this.getRegions();
      });
  }

}
