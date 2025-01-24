import DateSelectionSet from './DateSelectionSet';

type ScheduleProps = {
  selectionSetsStore?: DateSelectionSet[];
};

export default class Schedule {
  selectionSetsStore: DateSelectionSet[];

  constructor({ selectionSetsStore = [] }: ScheduleProps = {}) {
    this.selectionSetsStore = selectionSetsStore;
  }

  sortSelectionSetsByOpeningDate() {}

  createNewSelectionSet() {
    return new Schedule({
      selectionSetsStore: [...this.selectionSetsStore, new DateSelectionSet()],
    });
  }
}
