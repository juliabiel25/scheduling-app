import DateSelectionSet from './DateSelectionSet';
import { v4 as uuidv4 } from 'uuid';

export interface ScheduleProps {
  selectionSetsStore?: { [id: string]: DateSelectionSet };
  focusedSelectionSetId?: string;
}

export default class Schedule {
  selectionSetsStore: { [id: string]: DateSelectionSet } = {};
  focusedSelectionSetId: string;

  constructor({
    selectionSetsStore = {},
    focusedSelectionSetId,
  }: ScheduleProps = {}) {
    // if a valid selectionSetsStore is not provided, initialize a new one
    if (Object.keys(selectionSetsStore).length === 0) {
      const initialSelectionSetUUID = uuidv4();
      this.selectionSetsStore[initialSelectionSetUUID] = new DateSelectionSet({
        id: initialSelectionSetUUID,
      });
    } else {
      this.selectionSetsStore = selectionSetsStore;
    }

    // if a focusedSelectionSetId is not provided, set it to the first selection set in the schedule
    this.focusedSelectionSetId =
      focusedSelectionSetId ?? Object.keys(this.selectionSetsStore)[0];
  }

  addNewSelectionSet(selectionSet: DateSelectionSet): Schedule {
    this.selectionSetsStore[selectionSet.id] = selectionSet;
    return new Schedule({
      selectionSetsStore: this.selectionSetsStore,
    });
  }
}
