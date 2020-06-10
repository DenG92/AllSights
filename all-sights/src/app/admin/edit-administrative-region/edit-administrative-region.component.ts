import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AdministrativeRegion } from '../../_helpers/models/region';

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
  selector: 'app-edit-administrative-region',
  templateUrl: './edit-administrative-region.component.html',
  styleUrls: ['./edit-administrative-region.component.scss']
})
export class EditAdministrativeRegionComponent implements OnInit {

  public region: AdministrativeRegion;
  public options: OptionsResponse;
  public localizationForm: FormArray;
  public regionsForm: FormArray;
  public subdivisionsForm: FormArray;
  public settlementsForm: FormArray;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.route.params.subscribe(value => {
      if (value.hasOwnProperty('id')) {
        this.api
          .getData<AdministrativeRegion >(`regions/administrative/${value.id}`, null, AdministrativeRegion)
          .subscribe((data: AdministrativeRegion) => {
            this.region = data;
            this.localizationForm = new FormArray([]);
            for (const lang in this.region.localization) {
              if (this.region.localization.hasOwnProperty(lang)) {
                this.pushLocalization(lang, this.region.localization[lang]);
              }
            }
            this.regionsForm = new FormArray([]);
            this.region.regions.forEach(region => {
              this.pushRegion(region.id, region.period.from, region.period.to);
            });
            this.subdivisionsForm = new FormArray([]);
            this.region.subdivisions.forEach(region => {
              this.pushSubdivision(region.id, region.period.from, region.period.to);
            });
          });
      }
    });
    this.getOptions();
  }

  getOptions() {
    this.options = {regions: [], settlements: []};
    this.api
      .getData<Options[]>('regions/administrative/options', {language: 'ua'})
      .subscribe((regions: Options[]) => this.options.regions = regions);
    this.api
      .getData<Options[]>('settlements/options', {language: 'ua'})
      .subscribe((settlements: Options[]) => this.options.settlements = settlements);
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
      .putData<AdministrativeRegion>(`regions/administrative/${this.region.id}/localization/${lang}`, body, AdministrativeRegion)
      .subscribe((region: AdministrativeRegion) => {
        this.region = region;
        localization.controls.language.disable();
        localization.markAsPristine();
        // TODO updated toast
      });
  }

  deleteLocalization(localization: FormGroup, index: number): void {
    const lang = localization.getRawValue().language;
    if (this.region.localization.hasOwnProperty(lang)) {
      this.api
        .deleteData<AdministrativeRegion>(`regions/administrative/${this.region.id}/localization/${lang}`, {}, AdministrativeRegion)
        .subscribe((region: AdministrativeRegion) => {
          this.region = region;
          this.localizationForm.removeAt(index);
          // TODO deleted toast
        });
    } else {
      this.localizationForm.removeAt(index);
    }
  }

  pushRegion(id: string, from: Date = null, to: Date = null) {
    this.regionsForm.push(new FormGroup({
      region: new FormControl({value: id, disabled: id}),
      from: new FormControl(from ? from : this.region.period.from),
      to: new FormControl(to ? to : this.region.period.to)
    }));
  }

  pushSubdivision(id: string, from: Date = null, to: Date = null) {
    this.subdivisionsForm.push(new FormGroup({
      region: new FormControl({value: id, disabled: id}),
      from: new FormControl(from ? from : this.region.period.from),
      to: new FormControl(to ? to : this.region.period.to)
    }));
  }

  updateRegion(parent: string, child: string, region: FormGroup): void {
    const id = region.getRawValue().region;
    const period = {
      from: region.value.from,
      to: region.value.to
    };
    this.api
      .putData<AdministrativeRegion>(`regions/administrative/${this.region.id}/region/${id}`, {parent, child, period}, AdministrativeRegion)
      .subscribe((reg: AdministrativeRegion) => {
        this.region = reg;
        region.controls.region.disable();
        region.markAsPristine();
        // TODO updated toast
      });
  }

  deleteRegion(parent: string, child: string, region: FormGroup, index: number): void {
    const id = region.getRawValue().region;
    const regionIndex = this.region[parent].findIndex(el => el.id === id);
    const form = region.parent as FormArray;
    if (regionIndex !== -1) {
      this.api
        .deleteData<AdministrativeRegion>(`regions/administrative/${this.region.id}/region/${id}`, {parent, child}, AdministrativeRegion)
        .subscribe((reg: AdministrativeRegion) => {
          this.region = reg;
          form.removeAt(index);
          // TODO deleted toast
        });
    } else {
      form.removeAt(index);
    }
  }

}
