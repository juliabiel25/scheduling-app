import { addDays, subDays } from 'date-fns';

class DateSelection {
  edgeDates: [] | [Date] | [Date, Date];
  openingDate?: Date;
  closingDate?: Date;

  constructor(edgeDates: [] | [Date] | [Date, Date] = []) {
    this.edgeDates = edgeDates;
    if (edgeDates.length === 1) {
      this.openingDate = edgeDates[0];
    }
    if (edgeDates.length === 2) {
      this.openingDate =
        edgeDates[0] < edgeDates[1] ? edgeDates[0] : edgeDates[1];
      this.closingDate =
        edgeDates[0] > edgeDates[1] ? edgeDates[0] : edgeDates[1];
    }
  }

  moveSecondaryEdgeDate(date: Date): DateSelection {
    if (this.edgeDates.length === 0) return new DateSelection([date]);
    return new DateSelection([this.edgeDates[0], date]);
  }

  startsInMonth([month, year]: [number, number]): boolean {
    return this.openingDate
      ? this.openingDate.getMonth() === month &&
          this.openingDate.getFullYear() === year
      : false;
  }

  endsInMonth([month, year]: [number, number]): boolean {
    return this.closingDate
      ? this.closingDate.getMonth() === month &&
          this.closingDate.getFullYear() === year
      : false;
  }

  includesMonth([month, year]: [number, number]): boolean {
    const monthFirst = new Date(year, month, 1);
    const monthLast = new Date(year, month + 1, 0);
    return this.openingDate && this.closingDate
      ? this.startsInMonth([month, year]) ||
          this.endsInMonth([month, year]) ||
          (this.openingDate <= monthFirst && this.closingDate >= monthLast)
      : false;
  }

  includesDate(day: Date): boolean {
    return this.openingDate && this.closingDate
      ? day >= this.openingDate && day <= this.closingDate
      : false;
  }

  getLength(): number {
    return this.openingDate && this.closingDate
      ? Math.ceil(
          (this.closingDate.getTime() - this.openingDate.getTime()) /
            (1000 * 3600 * 24),
        )
      : 0;
  }

  isBlank(): boolean {
    return this.edgeDates.length === 0;
  }

  isComplete(): boolean {
    return this.edgeDates.length === 2;
  }

  isIncomplete(): boolean {
    return this.edgeDates.length === 1;
  }

  toString(): string {
    if (this.isComplete())
      return `${this.openingDate?.toLocaleDateString(
        'en-US',
      )} - ${this.closingDate?.toLocaleDateString('en-US')}`;
    return `${this.openingDate?.toLocaleDateString('en-US')} - ...`;
  }

  pushEdgeDate(date: Date): DateSelection {
    // selection is blank and the date
    if (!this.openingDate) this.openingDate = date;

    // selection is incomplete and the date is the new opening date
    if (!this.closingDate && date < this.openingDate) {
      this.closingDate = this.openingDate;
      this.openingDate = date;
    }

    // selection is incomplete and the date is the new closing date
    if (!this.closingDate && date > this.openingDate) {
      this.closingDate = date;
    }

    // selection is complete but the date precedes the opening date
    if (this.closingDate && date < this.openingDate) {
      this.openingDate = date;
    }

    // selection is complete but the date proceeds the ending date
    if (this.closingDate && date > this.closingDate) {
      this.closingDate = date;
    }

    return this;
  }
}

export class CompleteDateSelection extends DateSelection {
  openingDate: Date;
  closingDate: Date;

  constructor(edgeDates: [Date, Date]) {
    super(edgeDates);
    this.openingDate =
      edgeDates[0] > edgeDates[1] ? edgeDates[1] : edgeDates[0];
    this.closingDate =
      edgeDates[0] < edgeDates[1] ? edgeDates[1] : edgeDates[0];
  }

  isDateInSelection(date: Date) {
    return date >= this.openingDate && date <= this.closingDate;
  }

  merge(selection: CompleteDateSelection) {
    const newOpeningDate =
      this.openingDate < selection.openingDate
        ? this.openingDate
        : selection.openingDate;
    const newClosingDate =
      this.closingDate > selection.closingDate
        ? this.closingDate
        : selection.closingDate;
    return new CompleteDateSelection([newOpeningDate, newClosingDate]);
  }

  overlapsWithSelection(selection: CompleteDateSelection): boolean {
    const partialRightOverlap =
      this.openingDate <= selection.openingDate &&
      this.closingDate >= selection.openingDate;
    const partialLeftOverlap =
      this.openingDate >= selection.openingDate &&
      this.closingDate <= selection.closingDate;
    const fullOverlap =
      (this.openingDate <= selection.openingDate &&
        this.closingDate >= selection.closingDate) ||
      (this.openingDate >= selection.openingDate &&
        this.closingDate <= selection.closingDate);
    return partialRightOverlap || partialLeftOverlap || fullOverlap;
  }

  removeOverlap(
    removedSelection: CompleteDateSelection,
  ): CompleteDateSelection[] {
    console.log('Removing overlap in selection: ', {
      dateSelection: this.toString(),
      removedSelection: removedSelection.toString(),
    });

    // if there is no overlap, return the current selection
    if (!this.overlapsWithSelection(removedSelection)) return [this];

    // if current selection is completely covered by the removed selection, return an empty array
    if (
      removedSelection.openingDate <= this.openingDate &&
      removedSelection.closingDate >= this.closingDate
    )
      return [];

    // if the current selection is parially covered by the removed selection, return the non-overlapping parts
    if (this.openingDate >= removedSelection.openingDate) {
      return [
        new CompleteDateSelection([
          addDays(removedSelection.closingDate, 1),
          this.closingDate,
        ]),
      ];
    }
    if (this.closingDate <= removedSelection.closingDate) {
      return [
        new CompleteDateSelection([
          this.openingDate,
          subDays(removedSelection.openingDate, 1),
        ]),
      ];
    }
    // if the removed selection is entirely contained within the current selection, return two new selections created by the split
    return [
      new CompleteDateSelection([
        this.openingDate,
        subDays(removedSelection.openingDate, 1),
      ]),
      new CompleteDateSelection([
        addDays(removedSelection.closingDate, 1),
        this.closingDate,
      ]),
    ];
  }
}

export default DateSelection;
