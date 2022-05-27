import RGBAColor from './RGBAColor';
import DateSelection, { CompleteDateSelection } from './DateSelection';

interface DateSelectionSetIn {
  index: number;
  dates?: Date[];
  times?: any;  // update when the time picker is in the works
  color?: RGBAColor;
}

export default class DateSelectionSet {
  index: number;
  dates: Date[];
  times?: any;
  color: RGBAColor;

  constructor({
    index = 0,
    dates = [],
    times = [],
    color = new RGBAColor({}),
  }: DateSelectionSetIn) {
    this.index = index;
    this.times = times;
    this.color = color;
    this.dates = dates;
  }

  // addDate(date: Date): void {

  // }
}
