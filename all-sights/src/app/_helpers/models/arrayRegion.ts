import { ILocalization } from './localization';
import { IPeriod } from './period';

export class ArrayRegion {
  public id: string;
  public localization: ILocalization;
  public period: IPeriod;

  constructor(id: string, localization: ILocalization, period: IPeriod) {
    this.id = id;
    this.localization = localization;
    this.period = period;
  }
}
