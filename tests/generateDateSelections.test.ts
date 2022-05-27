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

    const selectionSetIndex = 1;

    const selectionSets = [
      new CompleteDateSelection({
        openingDate: new Date(2022, 1, 1),
        closingDate: new Date(2022, 1, 3),
        selectionSetIndex: selectionSetIndex
      }),
      new CompleteDateSelection({
        openingDate: new Date(2022, 1, 14),
        closingDate: new Date(2022, 1, 14),
        selectionSetIndex: selectionSetIndex
      }),
      new CompleteDateSelection({
        openingDate: new Date(2022, 1, 17),
        closingDate: new Date(2022, 1, 18),
        selectionSetIndex: selectionSetIndex
      })
    ]
    
    expect(generateDateSelections(dates, selectionSetIndex))
      .toStrictEqual(selectionSets);
  });
});
