import { Adapter } from './adapter';
import { ArrayRegion } from './arrayRegion';
import { ILocalization } from './localization';
import { IPopulation } from './population';

export class Settlement extends Adapter<Settlement> {
  public id: string;
  public localization: ILocalization;
  public area: number;
  public population: IPopulation[];
  public regions: ArrayRegion[];

  constructor(id: string, localization: ILocalization, area: number, population: IPopulation[], regions: ArrayRegion[]) {
    super();
    this.id = id;
    this.localization = localization;
    this.area = area;
    this.population = [];
    this.regions = regions;
  }

  static adapt(region: any): Settlement {
    const {_id, regions, ...rest} = region;
    regions.forEach((item, index) => {
      regions[index] = new ArrayRegion(item.region, item.localization, item.period);
    });
    return new Settlement(_id, rest.localization, rest.area, rest.population, regions);
  }
}
