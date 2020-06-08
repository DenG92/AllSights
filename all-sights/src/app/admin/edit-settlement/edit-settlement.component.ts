import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Settlement } from '../../_helpers/models/settlement';

import { ApiService } from '../../_helpers/services/api.service';

@Component({
  selector: 'app-edit-settlement',
  templateUrl: './edit-settlement.component.html',
  styleUrls: ['./edit-settlement.component.scss']
})
export class EditSettlementComponent implements OnInit {

  public language: string;
  public settlement: Settlement;

  constructor(private route: ActivatedRoute, private api: ApiService) {
    this.language = 'ua';
  }

  ngOnInit() {
    this.route.params.subscribe(value => {
      if (value.hasOwnProperty('id')) {
        this.api
          .getData<Settlement>(`settlements/${value.id}`, null, Settlement)
          .subscribe((data: Settlement) => this.settlement = data);
      }
    });
  }

}
