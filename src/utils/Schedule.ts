import DateSelectionSet from './DateSelectionSet';
import MonthRange from './MonthRange';

export default class Schedule {
  selections: DateSelectionSet[] = [new DateSelectionSet({ id: 1 })];
  dateRange: MonthRange | null = null;
  constructor() {}

  getSelectionSetIndex(id: number): number {
    return this.selections.findIndex((selectionSet) => selectionSet.id === id);
  }
}
