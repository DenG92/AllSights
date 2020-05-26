import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public routes = [
    { path: '/', title: 'Home' },
    { path: '/regions', title: 'Regions' }
  ];
}
