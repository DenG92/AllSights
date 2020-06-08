import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public routes: any[];

  constructor() {
    this.routes = [
      { path: '/admin', title: 'Dashboard' },
      { path: '/admin/regions', title: 'Regions' },
      { path: '/admin/settlements', title: 'Settlements' }
    ];
  }

  ngOnInit() {}

}
