import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';

export interface Options {
  value: string;
  label: string;
}

export interface OptionsResponse {
  regions: Options[];
  settlements: Options[];
}


@Component({
  selector: 'app-add-administrative-region',
  templateUrl: './add-administrative-region.component.html',
  styleUrls: ['./add-administrative-region.component.scss']
})
export class AddAdministrativeRegionComponent implements OnInit {

  public regionForm: FormGroup;
  public options: OptionsResponse;

  public get form() { return this.regionForm.controls; }

  constructor(public router: Router, public http: HttpClient) {
    this.regionForm = new FormGroup({
      language: new FormControl('ua'),
      title: new FormControl(''),
      description: new FormControl(''),
      period: new FormGroup({
        from: new FormControl(null),
        to: new FormControl(null)
      }),
      area: new FormControl(null),
      population: new FormArray([]),
      adminCenter: new FormControl(''),
      regions: new FormArray([]),
      subdivisions: new FormArray([]),
      settlements: new FormArray([])
    });
    this.getAutoCompleteOptions();
  }

  ngOnInit() {
    this.form.language.valueChanges.subscribe(() => {
      this.getAutoCompleteOptions();
    });
  }

  getAutoCompleteOptions() {
    const url = 'http://localhost:3000/api/regions/administrative/options';
    this.options = {regions: [], settlements: []};
    this.http
      .request<Options[]>('GET', url, {params: {type: 'regions', language: this.form.language.value}})
      .subscribe((data: Options[]) => this.options.regions = data);
    this.http
      .request<Options[]>('GET', url, {params: {type: 'settlements', language: this.form.language.value}})
      .subscribe((data: Options[]) => this.options.settlements = data);
  }

  getOptions() {
    const url = 'http://localhost:3000/api/regions/administrative/options';
    this.http
      .request<OptionsResponse>('GET', url, {params: {language: this.form.language.value}})
      .subscribe((data: OptionsResponse) => {
        this.options = {
          regions: data.regions,
          settlements: data.settlements
        };
      });
  }

  addRegion() {
    const regions = this.form.regions as FormArray;
    regions.push(new FormGroup({region: new FormControl(null), from: new FormControl(null), to: new FormControl(null)}));
  }

  removeRegion(index) {
    const regions = this.form.regions as FormArray;
    regions.removeAt(index);
  }

  addSubdivision() {
    const subdivisions = this.form.subdivisions as FormArray;
    subdivisions.push(new FormGroup({region: new FormControl(null), from: new FormControl(null), to: new FormControl(null)}));
  }

  removeSubdivision(index) {
    const subdivisions = this.form.subdivisions as FormArray;
    subdivisions.removeAt(index);
  }

  addSettlement() {
    const settlements = this.form.settlements as FormArray;
    settlements.push(new FormGroup({settlement: new FormControl(null), from: new FormControl(null), to: new FormControl(null)}));
  }

  removeSettlement(index) {
    const settlements = this.form.settlements as FormArray;
    settlements.removeAt(index);
  }

  addPopulation() {
    const population = this.form.population as FormArray;
    population.push(new FormGroup({year: new FormControl(null), quantity: new FormControl(null)}));
  }

  removePopulation(index) {
    const population = this.form.population as FormArray;
    population.removeAt(index);
  }

  saveRegion() {
    this.http.post('http://localhost:3000/api/regions/administrative', this.regionForm.value).subscribe(data => {
      this.router.navigateByUrl('admin/regions').then();
    });
  }

}
