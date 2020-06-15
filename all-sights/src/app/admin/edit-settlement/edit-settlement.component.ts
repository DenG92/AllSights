import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Settlement } from '../../_helpers/models/settlement';

import { ApiService } from '../../_helpers/services/api.service';

export interface Options {
  value: string;
  label: string;
}

@Component({
  selector: 'app-edit-settlement',
  templateUrl: './edit-settlement.component.html',
  styleUrls: ['./edit-settlement.component.scss']
})
export class EditSettlementComponent implements OnInit {

  public settlement: Settlement;
  public regions: Options[];
  public generalForm: FormGroup;
  public localizationForm: FormArray;
  public regionsForm: FormArray;

  public get form() { return this.generalForm.controls; }

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.route.params.subscribe(value => {
      if (value.hasOwnProperty('id')) {
        this.api
          .getData<Settlement>(`settlements/${value.id}`, null, Settlement)
          .subscribe((data: Settlement) => {
            this.settlement = data;
            this.generalForm = new FormGroup({
              area: new FormControl(this.settlement.area),
              population: new FormArray([])
            });
            this.settlement.population.forEach(pop => {
              this.pushPopulation(pop.year, pop.quantity);
            });
            this.localizationForm = new FormArray([]);
            for (const lang in this.settlement.localization) {
              if (this.settlement.localization.hasOwnProperty(lang)) {
                this.pushLocalization(lang, this.settlement.localization[lang]);
              }
            }
            this.regionsForm = new FormArray([]);
            this.settlement.regions.forEach(region => {
              this.pushRegion(region.id, region.period.from, region.period.to);
            });
          });
      }
    });
    this.getOptions();
  }

  getOptions() {
    this.regions = [];
    this.api
      .getData<Options[]>('regions/administrative/options', {language: 'ua'})
      .subscribe((regions: Options[]) => this.regions = regions);
  }

  pushPopulation(year: number = null, quantity: number = null): void {
    const population = this.form.population as FormArray;
    population.push(new FormGroup({
      year: new FormControl(year),
      quantity: new FormControl(quantity)
    }));
  }

  deletePopulation(index: number) {
    const population = this.form.population as FormArray;
    population.removeAt(index);
  }

  update() {
    this.api
      .putData<Settlement>(`settlements/${this.settlement.id}`, this.generalForm.value, Settlement)
      .subscribe((settlement: Settlement) => {
        this.settlement = settlement;
        // TODO updated toast
      });
  }

  pushLocalization(language: string = '', localization: {title: string, description: string} = null): void {
    this.localizationForm.push(new FormGroup({
      language: new FormControl({value: language, disabled: language}),
      title: new FormControl(localization ? localization.title : ''),
      description: new FormControl(localization ? localization.description : '')
    }));
  }

  updateLocalization(localization: FormGroup): void {
    const lang = localization.getRawValue().language;
    const body = {
      title: localization.value.title,
      description: localization.value.description
    };
    this.api
      .putData<Settlement>(`settlements/${this.settlement.id}/localization/${lang}`, body, Settlement)
      .subscribe((settlement: Settlement) => {
        this.settlement = settlement;
        localization.controls.language.disable();
        localization.markAsPristine();
        // TODO updated toast
      });
  }

  deleteLocalization(localization: FormGroup, index: number): void {
    const lang = localization.getRawValue().language;
    if (this.settlement.localization.hasOwnProperty(lang)) {
      this.api
        .deleteData<Settlement>(`settlements/${this.settlement.id}/localization/${lang}`, {}, Settlement)
        .subscribe((settlement: Settlement) => {
          this.settlement = settlement;
          this.localizationForm.removeAt(index);
          // TODO deleted toast
        });
    } else {
      this.localizationForm.removeAt(index);
    }
  }

  pushRegion(id: string, from: string = '', to: string = '') {
    this.regionsForm.push(new FormGroup({
      region: new FormControl({value: id, disabled: id}),
      from: new FormControl(from),
      to: new FormControl(to)
    }));
  }

  updateRegion(region: FormGroup): void {
    const id = region.getRawValue().region;
    const period = {from: region.value.from, to: region.value.to};
    const regionIndex = this.settlement.regions.findIndex(el => el.id === id);
    const endpoint = `settlements/${this.settlement.id}/region/${id}`;
    if (regionIndex !== -1) {
      this.api
        .putData<Settlement>(endpoint, {period}, Settlement)
        .subscribe((settlement: Settlement) => {
          this.settlement = settlement;
          region.controls.region.disable();
          region.markAsPristine();
          // TODO updated toast
        });
    } else {
      this.api
        .postData<Settlement>(endpoint, {period}, Settlement)
        .subscribe((settlement: Settlement) => {
          this.settlement = settlement;
          region.controls.region.disable();
          region.markAsPristine();
          // TODO updated toast
        });
    }

  }

  deleteRegion(region: FormGroup, index: number): void {
    const id = region.getRawValue().region;
    const regionIndex = this.settlement.regions.findIndex(el => el.id === id);
    const form = region.parent as FormArray;
    if (regionIndex !== -1) {
      this.api
        .deleteData<Settlement>(`settlements/${this.settlement.id}/region/${id}`, {}, Settlement)
        .subscribe((settlement: Settlement) => {
          this.settlement = settlement;
          form.removeAt(index);
          // TODO deleted toast
        });
    } else {
      form.removeAt(index);
    }
  }

}
