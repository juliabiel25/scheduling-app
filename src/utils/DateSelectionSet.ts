import RGBAColor from './RGBAColor';
import { v4 as uuidv4 } from 'uuid';
import { CompleteDateSelection } from './DateSelection';
import { isNextDay } from './functions';

export type DateSelectionSetProps = {
  id?: string;
  dateSelections?: CompleteDateSelection[];
  timeSelections?: any;
  color?: RGBAColor;
};

export default class DateSelectionSet {
  id: string;
  dateSelections: CompleteDateSelection[];
  timeSelections?: any;
  color: RGBAColor;

  constructor({
    id = uuidv4(),
    dateSelections = [],
    timeSelections = {},
    color = new RGBAColor({}),
  }: DateSelectionSetProps = {}) {
    this.id = id;
    this.dateSelections = dateSelections;
    this.timeSelections = timeSelections;
    this.color = color;
  }

  addDateSelectionToSet(selection: CompleteDateSelection): DateSelectionSet {
    // if no selection exist within the selection set, simply add the new selection
    if (this.dateSelections.length === 0) {
      // ok
      return new DateSelectionSet({
        id: this.id,
        dateSelections: [selection],
        timeSelections: this.timeSelections,
        color: this.color,
      });
    }

    // if there are existing selections, merge the new selection with the existing ones and sort by the opening date
    const mergedDateSelections = [...this.dateSelections, selection].sort(
      (a, b) => a.openingDate.getTime() - b.openingDate.getTime(),
    );

    // check if the ranges overlap or touch
    const finalDateSelections: CompleteDateSelection[] = [];
    let aggregateDateSelection = mergedDateSelections[0];
    let index = 1;
    while (index < mergedDateSelections.length) {
      const currentSelection = mergedDateSelections[index];
      const previousSelection = mergedDateSelections[index - 1];

      // if the closing date of the previous selection is greater than the opening date of the current selection, merge them
      if (
        previousSelection.closingDate.getTime() >=
          currentSelection.openingDate.getTime() ||
        isNextDay(previousSelection.closingDate, currentSelection.openingDate)
      ) {
        // merge the two overlapping selections
        aggregateDateSelection = previousSelection.merge(currentSelection);

        // replace the previous selection with the newly merged one (used for recurrent merges)
        mergedDateSelections[index - 1] = aggregateDateSelection;

        mergedDateSelections.splice(index, 1); // remove the current selection (already included in the merged previous)
      } else {
        // else, push the aggregated selections and start a new aggregate with the current one
        finalDateSelections.push(aggregateDateSelection);
        aggregateDateSelection = currentSelection;
        index++;
      }
    }

    // Push the last aggregate selection
    finalDateSelections.push(aggregateDateSelection);

    return new DateSelectionSet({
      id: this.id,
      dateSelections: finalDateSelections,
      timeSelections: this.timeSelections,
      color: this.color,
    });
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
          new CompleteDateSelection([
            selection.openingDate,
            removedSelection.openingDate,
          ]),
          new CompleteDateSelection([
            removedSelection.closingDate,
            selection.closingDate,
          ]),
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

    this.dateSelections = finalDateSelections;
  }

  includesDate = (date: Date): boolean => {
    return this.dateSelections.some((selection) =>
      selection.includesDate(date),
    );
  };
}
