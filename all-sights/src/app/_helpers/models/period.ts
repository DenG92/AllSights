export interface IPeriod {
  from: string;
  to: string;
}

export class Period implements IPeriod {
  public from: string;
  public to: string;

  get duration() {
    if (this.from) {
      const to = this.to ? new Date(this.to) : new Date();
      const from = new Date(this.from);
      return `${((to.getTime() - from.getTime()) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(2)} years`;
    } else {
      return 'Undefined';
    }
  }

  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }

  toString() {
    const from = this.from ? this.from.replace(/-/g, '.') : 'Unknown';
    const to = this.to ? this.to.replace(/-/g, '.') : `${new Date().toISOString().slice(0, 10).replace(/-/g, '.')}`;
    return `(${from} - ${to})`;
  }

}
