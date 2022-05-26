class DateSelection{
  openingDate?: Date;
  closingDate?: Date;
  selectionSetIndex?: number;

  constructor({
    openingDate,
    closingDate,
    selectionSetIndex,
  }: {
    openingDate?: Date;
    closingDate?: Date;
    selectionSetIndex?: number;
  }) {
    this.openingDate = openingDate;
    this.closingDate = closingDate;
    this.selectionSetIndex = selectionSetIndex;
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

  includesDay(day: Date): boolean {
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
    return !this.openingDate && !this.closingDate;
  }

  isComplete(): boolean {
    return !!this.openingDate && !!this.closingDate;
  }

  isIncomplete(): boolean {
    return !!this.openingDate && !this.closingDate;
  }

  toString(): string {
    if (this.isComplete())
      return `${this.openingDate?.toLocaleDateString(
        'en-US',
      )} - ${this.closingDate?.toLocaleDateString('en-US')}`;
    return `${this.openingDate?.toLocaleDateString('en-US')} - ...`;
  }
}

interface CompleteDateSelectionIn {
  openingDate: Date;
  closingDate: Date;
  selectionSetIndex?: number;
}

export class CompleteDateSelection extends DateSelection {
  openingDate: Date;
  closingDate: Date;

  constructor({
    openingDate,
    closingDate,
    selectionSetIndex,
  }: CompleteDateSelectionIn) {
    super({});
    this.openingDate = openingDate;
    this.closingDate = closingDate;
    this.selectionSetIndex = selectionSetIndex;
  }
}


export default DateSelection;
