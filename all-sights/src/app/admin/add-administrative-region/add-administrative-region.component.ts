import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { ApiService } from '../../_helpers/services/api.service';

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

  constructor(public router: Router, public api: ApiService) {
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
    this.getOptions();
  }

  ngOnInit() {
    this.form.language.valueChanges.subscribe(() => {
      this.getOptions();
    });
  }

  getOptions() {
    this.options = {regions: [], settlements: []};
    this.api
      .getData<Options[]>('regions/administrative/options', {language: this.form.language.value})
      .subscribe((regions: Options[]) => this.options.regions = regions);
    this.api
      .getData<Options[]>('settlements/options', {language: this.form.language.value})
      .subscribe((settlements: Options[]) => this.options.settlements = settlements);
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
    this.api.postData('regions/administrative', this.regionForm.value).subscribe(() => {
      this.router.navigateByUrl('admin/regions').then();
    });
  }

}
