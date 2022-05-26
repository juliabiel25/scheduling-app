import { subtractDays } from '../src/utils/functions';

describe('testing the addDays utility function', () => {
  test('date - 0 should result in the same date', () => {
    const date = new Date();
    expect(subtractDays(date, 0)).toStrictEqual(date);
  });

  test('date - 1 should result in the previous day', () => {
    const today = new Date(2022, 2, 22);
    const yesterday = new Date(2022, 2, 21);
    expect(subtractDays(today, 1)).toStrictEqual(yesterday);
  });
});
