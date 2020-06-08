import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Settlement } from '../../_helpers/models/settlement';

import { ApiService } from '../../_helpers/services/api.service';

@Component({
  selector: 'app-admin-settlements',
  templateUrl: './admin-settlements.component.html',
  styleUrls: ['./admin-settlements.component.scss']
})
export class AdminSettlementsComponent implements OnInit {

  public language: string;
  public settlements: Settlement[];

  constructor(private router: Router, private api: ApiService) {
    this.language = 'ua';
    this.settlements = [];
  }

  ngOnInit() {
    this.getSettlements();
  }

  getSettlements() {
    this.api
      .getData<Settlement[]>('settlements', null, Settlement)
      .subscribe((settlements: Settlement[]) => this.settlements = settlements);
  }

  add() {
    this.router.navigateByUrl(`/admin/settlements/add`).then();
  }

  edit(id) {
    this.router.navigateByUrl(`/admin/settlements/${id}`).then();
  }

  delete(id) {
    this.api
      .deleteData<any>(`settlements/${id}`)
      .subscribe((settlement: any) => {
        // tslint:disable:no-console
        console.info('Deleted settlement: ', settlement);
        this.getSettlements();
      });
  }

}
