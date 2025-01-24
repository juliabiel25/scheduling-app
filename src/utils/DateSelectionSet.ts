import RGBAColor from './RGBAColor';
import { CompleteDateSelection } from './DateSelection';
import { randomUUID } from 'crypto';

export default class DateSelectionSet {
  id: string;
  dateSelections: CompleteDateSelection[];
  timeSelections?: any;
  color: RGBAColor;

  constructor({
    id = randomUUID(),
    dateSelections = [],
    timeSelections = {},
    color = new RGBAColor({}),
  } = {}) {
    this.id = id;
    this.dateSelections = dateSelections;
    this.timeSelections = timeSelections;
    this.color = color;
  }

  addDateSelectionToSet(selection: CompleteDateSelection): void {
    const mergedDateSelections = [...this.dateSelections, selection].sort(
      // sort date selections by opening date
      (a, b) => a.openingDate.getTime() - b.openingDate.getTime(),
    );

    // check if the ranges overlap
    const finalDateSelections = [];
    let aggregateDateSelection = mergedDateSelections[0];
    let i = 0;
    while (i < mergedDateSelections.length - 1) {
      if (
        mergedDateSelections[i].closingDate.getTime() >=
        mergedDateSelections[i + 1].openingDate.getTime()
      ) {
        // if ranges overlap, merge them and continue analyzing overlaps with following members
        const { openingDate } = mergedDateSelections[i];
        const { closingDate } = mergedDateSelections[i + 1];
        aggregateDateSelection = new CompleteDateSelection({
          openingDate,
          closingDate,
        });
      } else {
        // if ranges do not overlap, push the aggregate selection and start a new one;
        // Move onto the next member
        finalDateSelections.push(aggregateDateSelection);
        aggregateDateSelection = mergedDateSelections[i + 1];
        i++;
      }
    }

    console.log('addDateSelectionToSet::', {
      previousSelections: this.dateSelections,
      newSelections: finalDateSelections,
    });
    this.dateSelections = finalDateSelections;
  }

  removeDateSelectionFromSet(removedSelection: CompleteDateSelection): void {
    let i = 0;
    let finalDateSelections: CompleteDateSelection[] = [];

    while (i < this.dateSelections.length) {
      const selection = this.dateSelections[i];

      // complete overlap between this selection and the removed selection - remove this selection entirely
      if (
        selection.openingDate <= removedSelection.openingDate &&
        selection.closingDate >= removedSelection.closingDate
      ) {
        continue;
      }

      // no overlap between this selection and the removed selection - no changes
      if (selection.closingDate < removedSelection.openingDate) {
        finalDateSelections.push(selection);
        continue;
      }

      // partial overlap towards the end of the selection - adjust the closing date
      if (
        selection.openingDate >= removedSelection.openingDate &&
        selection.closingDate > removedSelection.closingDate
      ) {
        selection.closingDate = removedSelection.openingDate;
        finalDateSelections.push(selection);
        continue;
      }

      // partial overlap towards the beginning of the selection - adjust the opening date
      if (
        selection.openingDate >= removedSelection.openingDate &&
        selection.closingDate > removedSelection.closingDate
      ) {
        selection.openingDate = removedSelection.closingDate;
        finalDateSelections.push(selection);
        continue;
      }

      // if the removed selection is entirely within the current selection - split the current selection into two
      if (
        selection.openingDate < removedSelection.openingDate &&
        selection.closingDate > removedSelection.closingDate
      ) {
        finalDateSelections.push(
          new CompleteDateSelection({
            openingDate: selection.openingDate,
            closingDate: removedSelection.openingDate,
          }),
          new CompleteDateSelection({
            openingDate: removedSelection.closingDate,
            closingDate: selection.closingDate,
          }),
        );
      }

      // if there is leftover to-be-removed indexes that go beyond the current selection - check the next selection for additionial overlaps.
      // Otherwise exit the loop and push the following selections with no more changes
      if (selection.closingDate < removedSelection.closingDate) {
        i++;
      } else {
        finalDateSelections = [
          ...finalDateSelections,
          ...this.dateSelections.slice(i + 1),
        ];
        break;
      }
    }

    console.log('removeDateSelectionFromSet::', {
      previousSelections: this.dateSelections,
      newSelections: finalDateSelections,
    });
    this.dateSelections = finalDateSelections;
  }

  isDateInSelectionSet(date: Date): boolean {
    return this.dateSelections.some((selection) =>
      selection.isDateInSelection(date),
    );
  }
}
