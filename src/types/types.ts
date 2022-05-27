import DateSelection from '../utils/DateSelection';
import RGBAColor from '../utils/RGBAColor';

export type selectionSetProp = {
  getColor: (index?: number) => RGBAColor | undefined;
  getIndex: () => number;
  addSelection: (selection: DateSelection) => void;
  removeDate: (setIndex: number, date: Date) => void;
};
