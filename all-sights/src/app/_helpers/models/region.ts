import { Adapter } from './adapter';
import { ArrayRegion } from './arrayRegion';
import { ILocalization } from './localization';
import { IPeriod } from './period';
import { IPopulation } from './population';

export class AdministrativeRegion extends Adapter<AdministrativeRegion> {
  public id: string;
  public localization: ILocalization;
  public period: IPeriod;
  public area: number;
  public population: IPopulation;
  public adminCenter: string;
  public regions: ArrayRegion[];
  public subdivisions: ArrayRegion[];
  public settlements: ArrayRegion[];

  constructor(id: string, localization: ILocalization, period: IPeriod, area: number, population, adminCenter: string, regions: ArrayRegion[], subdivisions: ArrayRegion[], settlements: ArrayRegion[]) {
    super();
    this.id = id;
    this.localization = localization;
    this.period = period;
    this.area = area;
    this.population = population;
    this.adminCenter = adminCenter;
    this.regions = regions;
    this.subdivisions = subdivisions;
    this.settlements = settlements;
  }

  static adapt(region: any): AdministrativeRegion {
    const {_id, regions, subdivisions, settlements, ...rest} = region;
    regions.forEach((item, index) => {
      regions[index] = new ArrayRegion(item.region, item.localization, item.period);
    });
    subdivisions.forEach((item, index) => {
      subdivisions[index] = new ArrayRegion(item.region, item.localization, item.period);
    });
    settlements.forEach((item, index) => {
      settlements[index] = new ArrayRegion(item.settlement, item.localization, item.period);
    });
    return new AdministrativeRegion(_id, rest.localization, rest.period, rest.area, rest.population, rest.adminCenter, regions, subdivisions, settlements);
  }
}
