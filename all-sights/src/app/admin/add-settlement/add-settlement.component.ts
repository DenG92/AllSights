import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiService } from '../../_helpers/services/api.service';

export interface Options {
  value: string;
  label: string;
}

@Component({
  selector: 'app-add-settlement',
  templateUrl: './add-settlement.component.html',
  styleUrls: ['./add-settlement.component.scss']
})
export class AddSettlementComponent implements OnInit {

  public settlementForm: FormGroup;
  public regions: Options[];

  public get form() { return this.settlementForm.controls; }

  constructor(public router: Router, public api: ApiService) {
    this.settlementForm = new FormGroup({
      language: new FormControl('ua'),
      title: new FormControl(''),
      description: new FormControl(''),
      area: new FormControl(null),
      population: new FormArray([]),
      regions: new FormArray([])
    });
    this.getOptions();
  }

  ngOnInit() {
    this.form.language.valueChanges.subscribe(() => {
      this.getOptions();
    });
  }

  getOptions() {
    this.regions = [];
    this.api
      .getData<Options[]>('regions/administrative/options', {language: this.form.language.value})
      .subscribe((data: Options[]) => this.regions = data);
  }

  addRegion() {
    const regions = this.form.regions as FormArray;
    regions.push(new FormGroup({region: new FormControl(null), from: new FormControl(null), to: new FormControl(null)}));
  }

  removeRegion(index) {
    const regions = this.form.regions as FormArray;
    regions.removeAt(index);
  }

  addPopulation() {
    const population = this.form.population as FormArray;
    population.push(new FormGroup({year: new FormControl(null), quantity: new FormControl(null)}));
  }

  removePopulation(index) {
    const population = this.form.population as FormArray;
    population.removeAt(index);
  }

  saveSettlement() {
    this.api.postData('settlements', this.settlementForm.value).subscribe(() => {
      this.router.navigateByUrl('admin/settlements').then();
    });
  }

}
