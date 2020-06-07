import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-administrative-regions',
  templateUrl: './administrative-regions.component.html',
  styleUrls: ['./administrative-regions.component.scss']
})
export class AdministrativeRegionsComponent implements OnInit {

  public language: string;
  public regions: any[];

  constructor(private http: HttpClient) {
    this.language = 'ua';
  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/api/regions/administrative').subscribe(regions => this.regions = regions);
  }

}
