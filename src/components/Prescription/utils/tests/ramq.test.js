import { extractBirthDateAndSexFromRamq } from '../ramq';

describe('extract ramq', () => {
  test('should not be in the futur', () => {
    expect(extractBirthDateAndSexFromRamq('TEST55072223', 'yyyy-MM-dd').birthDate).toEqual(
      '1955-07-22',
    );
  });
});
