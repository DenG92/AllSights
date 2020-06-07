import { Component, Input, AfterViewInit, OnChanges, forwardRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import SelectPure from 'select-pure';

export const CUSTOM_VALUE_ACCESSOR: any = {
  provide : NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ExtraSelectComponent),
  multi : true
};

@Component({
  selector: 'app-extra-select',
  providers: [CUSTOM_VALUE_ACCESSOR],
  template: '<div id="{{ selectId }}"></div>',
  styleUrls: ['./extra-select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExtraSelectComponent implements AfterViewInit, OnChanges, ControlValueAccessor {

  public instance;
  public value;
  private onChange;
  private onTouched;
  @Input() selectId;
  @Input() options;

  constructor() {
    this.onChange = (value: any) => {};
    this.onTouched = () => {};
  }

  ngAfterViewInit(): void {
    this.instance = this.getSelect();
  }

  ngOnChanges(changes: any): void {
    if (changes.options && !changes.options.firstChange) {
      this.instance = null;
      document.body.querySelector(`#${this.selectId}`).innerHTML = '';
      this.instance = this.getSelect();
    }
  }

  getSelect(): SelectPure {
    return new SelectPure(`#${this.selectId}`, {
      options: this.options,
      multiple: true,
      autocomplete: true,
      icon: 'select-close',
      placeholder: 'Select region',
      classNames: {
        select: 'select',
        multiselect: 'multiple',
        autocompleteInput: 'auto-complete',
        placeholder: 'placeholder',
        placeholderHidden: 'hidden',
        label: 'label',
        selectedLabel: 'selected-label',
        dropdown: 'options',
        dropdownShown: 'select-opened',
        option: 'option',
        optionHidden: 'hidden',
        selectedOption: 'selected',
      },
      onChange: value => {
        this.value = value;
        this.onChange(this.value);
        this.onTouched();
      }
    });
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}
