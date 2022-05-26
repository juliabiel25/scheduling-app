import { addDays } from '../src/utils/functions';

describe('testing the addDays utility function', () => {
    test('date + 0 should result in the same date', () => {
        const date = new Date();
        expect(addDays(date, 0)).toStrictEqual(date);
    })

    test('date + 1 should result in the next day', () => {
        const today = new Date(2022, 2, 22);
        const tomorrow = new Date(2022, 2, 23);
        expect(addDays(today, 1)).toStrictEqual(tomorrow);
    })
})