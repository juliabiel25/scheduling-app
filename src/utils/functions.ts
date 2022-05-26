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
