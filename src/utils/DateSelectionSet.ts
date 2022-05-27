import RGBAColor from './RGBAColor';

interface DateSelectionSetIn {
  id: number;
  dates?: Date[];
  times?: any; // update when the time picker is in the works
  color?: RGBAColor;
}

export default class DateSelectionSet {
  id: number;
  dates: Date[];
  times?: any;
  color: RGBAColor;

  constructor({
    id = 1,
    dates = [],
    times = [],
    color = new RGBAColor({}),
  }: DateSelectionSetIn) {
    this.id = id;
    this.times = times;
    this.color = color;
    this.dates = dates;
  }
}
