import { CompleteDateSelection } from '../src/utils/DateSelection';
import { generateDateSelections } from '../src/utils/functions';

describe('testing the generateDatesInRange utility function', () => {
  test('a list of dates should return a list of consecutive date selections', () => {
    const dates = [
      new Date(2022, 1, 1),
      new Date(2022, 1, 2),
      new Date(2022, 1, 3),
      new Date(2022, 1, 14),
      new Date(2022, 1, 17),
      new Date(2022, 1, 18),
    ];

    const selectionSets = [
      new CompleteDateSelection([new Date(2022, 1, 1), new Date(2022, 1, 3)]),
      new CompleteDateSelection([new Date(2022, 1, 14), new Date(2022, 1, 14)]),
      new CompleteDateSelection([new Date(2022, 1, 17), new Date(2022, 1, 18)]),
    ];

    expect(generateDateSelections(dates)).toStrictEqual(selectionSets);
  });
});
