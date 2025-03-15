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

  mergeSelectionsOverlap(): DateSelectionSet {
    // if there are existing selections, merge the new selection with the existing ones and sort by the opening date
    const mergedDateSelections = this.dateSelections.sort(
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
    const mergedDateSelections = [...this.dateSelections, selection];
    const newSelectionSet = new DateSelectionSet({
      id: this.id,
      dateSelections: mergedDateSelections,
      timeSelections: this.timeSelections,
      color: this.color,
    });

    return newSelectionSet.mergeSelectionsOverlap();
  }

  removeDateSelectionFromSet(
    removedDateSelection: CompleteDateSelection,
  ): DateSelectionSet {
    // if there is no overlap between the to-be-removed selection and the current selection set, return the current selection set with no changes
    if (!this.overlapsWithDateSelection(removedDateSelection)) {
      return this;
    }

    // if there is overlap - remove it
    const updatedSelections = this.dateSelections.flatMap((selection) => {
      const updatedSelection = selection.removeOverlap(removedDateSelection);
      console.log('Selection after removing overlap: ', updatedSelection);
      return updatedSelection;
    });

    return new DateSelectionSet({
      id: this.id,
      dateSelections: updatedSelections,
      timeSelections: this.timeSelections,
      color: this.color,
    });
  }

  includesDate(date: Date): boolean {
    return this.dateSelections.some((selection) =>
      selection.includesDate(date),
    );
  }

  overlapsWithDateSelection(dateSelection: CompleteDateSelection): boolean {
    // the selection set has some overlap with a date selection if any of of its selections overlaps with it
    return this.dateSelections.some((selection) =>
      selection.overlapsWithSelection(dateSelection),
    );
  }
}
