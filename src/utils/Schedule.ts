import DateSelectionSet from './DateSelectionSet';
import { v4 as uuidv4 } from 'uuid';

export interface ScheduleProps {
  selectionSetsStore?: { [id: string]: DateSelectionSet };
}

export default class Schedule {
  selectionSetsStore: { [id: string]: DateSelectionSet } = {};

  constructor({ selectionSetsStore = {} }: ScheduleProps = {}) {
    // if a valid selectionSetsStore is not provided, initialize a new one
    if (Object.keys(selectionSetsStore).length === 0) {
      const initialSelectionSetUUID = uuidv4();
      this.selectionSetsStore[initialSelectionSetUUID] = new DateSelectionSet({
        id: initialSelectionSetUUID,
      });
    } else {
      this.selectionSetsStore = selectionSetsStore;
    }
  }

  addNewSelectionSet(selectionSet: DateSelectionSet): Schedule {
    this.selectionSetsStore[selectionSet.id] = selectionSet;
    return new Schedule({
      selectionSetsStore: this.selectionSetsStore,
    });
  }
}
