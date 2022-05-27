import { generateDatesInRange } from '../src/utils/functions';

describe('testing the generateDatesInRange utility function', () => {
  test('date in given range should result in an array of dates included in the range', () => {
    const openingDate = new Date(2022, 1, 1);
    const closingDate = new Date(2022, 1, 3);
    const dates = [
        openingDate,
        new Date(2022, 1, 2),
        closingDate
    ]
    expect(generateDatesInRange(openingDate, closingDate)).toStrictEqual(dates);
  });

});
