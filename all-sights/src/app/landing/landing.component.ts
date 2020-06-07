import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  public routes = [
    { path: '/', title: 'Home' },
    { path: '/regions', title: 'Regions' }
  ];

  constructor() {}

  ngOnInit() {}

}
