import { ILocalization } from './localization';
import { IPeriod, Period } from './period';

export class ArrayRegion {
  public id: string;
  public localization: ILocalization;
  public period: Period;

  constructor(id: string, localization: ILocalization, period: IPeriod) {
    this.id = id;
    this.localization = localization;
    this.period = new Period(period.from, period.to);
  }
}
