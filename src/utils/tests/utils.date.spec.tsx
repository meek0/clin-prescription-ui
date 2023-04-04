import { formatDate } from '../date';

describe('Utils: Date', () => {
  test('Should ignore the time part of the date', () => {
    expect(formatDate('2022-08-01T17:44:18+00:00')).toEqual('2022-08-01');
  });
  test('Should return the exact same date as input', () => {
    expect(formatDate('1990-07-20')).toEqual('1990-07-20');
  });
});
