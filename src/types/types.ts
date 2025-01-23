import DateSelection from '../utils/DateSelection';
import RGBAColor from '../utils/RGBAColor';

export type selectionSetProp = {
  getColor: (index?: number) => RGBAColor | undefined;
  getFocusedId: number;
  addSelection: (selection: DateSelection) => void;
  removeDate: (setIndex: number, date: Date) => void;
};

export class MonthIndex {
  month: number;
  year: number;
  constructor(month: number, year: number) {
    this.month = month;
    this.year = year;
  }
  getString() {
    return `${this.month}-${this.year}`;
  }
}
