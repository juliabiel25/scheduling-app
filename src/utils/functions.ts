import { CompleteDateSelection } from './DateSelection';

export const range = (start: number, end: number): number[] =>
  Array(end - start + 1)
    .fill(undefined)
    .map((_, idx) => start + idx);

export const addDays = (date: Date, days: number): Date => {
  const time = date.getTime();
  const newTime = time + days * (1000 * 3600 * 24);
  const newDate = new Date(newTime);
  return newDate;
};

export const subtractDays = (date: Date, days: number): Date => {
  const time = date.getTime();
  const newTime = time - days * (1000 * 3600 * 24);
  const newDate = new Date(newTime);
  return newDate;
};

export const generateDatesInRange = (
  openingDate: Date,
  closingDate: Date,
): Date[] => {
  let dateArr: Date[] = [];

  for (let date = openingDate; date <= closingDate; date = addDays(date, 1)) {
    dateArr = [...dateArr, new Date(date)];
  }
  return dateArr;
};

export const isNextDay = (dateA: Date, dateB: Date): boolean => {
  const nextDay = new Date(dateA);
  nextDay.setDate(nextDay.getDate() + 1);

  return (
    dateB.getDate() === nextDay.getDate() &&
    dateB.getMonth() === nextDay.getMonth() &&
    dateB.getFullYear() === nextDay.getFullYear()
  );
};

export const generateDateSelections = (
  dates: Date[],
): CompleteDateSelection[] => {
  dates = dates.sort((a, b) => (a < b ? -1 : 1));
  let dateSelections: CompleteDateSelection[] = [];

  // foreach date, look for a joinable selection or make a new one
  for (let date of dates) {
    let index = dateSelections.findIndex(
      (selection) =>
        addDays(selection.closingDate, 1).getTime() === date.getTime(),
    );

    if (index !== -1) {
      dateSelections = [
        ...dateSelections.slice(0, index),
        new CompleteDateSelection([dateSelections[index].openingDate, date]),
        ...dateSelections.slice(index + 1),
      ];
    } else {
      index = dateSelections.findIndex(
        (selection) =>
          subtractDays(selection.openingDate, 1).getTime() === date.getTime(),
      );

      if (index !== -1) {
        dateSelections = [
          ...dateSelections.slice(0, index),
          new CompleteDateSelection([date, dateSelections[index].openingDate]),
          ...dateSelections.slice(index + 1),
        ];
      } else {
        dateSelections.push(new CompleteDateSelection([date, date]));
      }
    }
  }
  return dateSelections;
};

export function replaceValueAtIndex<T>(array: T[], index: number, value: T) {
  const newArray = [...array];
  newArray[index] = value;
  return newArray;
}
