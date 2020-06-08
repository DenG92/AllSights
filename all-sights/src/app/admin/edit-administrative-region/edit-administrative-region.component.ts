import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministrativeRegion } from '../../_helpers/models/region';

import { ApiService } from '../../_helpers/services/api.service';

@Component({
  selector: 'app-edit-administrative-region',
  templateUrl: './edit-administrative-region.component.html',
  styleUrls: ['./edit-administrative-region.component.scss']
})
export class EditAdministrativeRegionComponent implements OnInit {

  public language: string;
  public region: AdministrativeRegion;

  constructor(private route: ActivatedRoute, private api: ApiService) {
    this.language = 'ua';
  }

  ngOnInit() {
    this.route.params.subscribe(value => {
      if (value.hasOwnProperty('id')) {
        this.api
          .getData<AdministrativeRegion >(`regions/administrative/${value.id}`, null, AdministrativeRegion)
          .subscribe((data: AdministrativeRegion) => this.region = data);
      }
    });
  }

}
