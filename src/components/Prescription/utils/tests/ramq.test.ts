import { extractBirthDateAndSexFromRamq } from '../ramq';

describe('extract ramq', () => {
  test('should not be in the futur', () => {
    expect(extractBirthDateAndSexFromRamq('TEST55072223', 'yyyy-MM-dd').birthDate).toEqual(
      '1955-07-22',
    );
    expect(extractBirthDateAndSexFromRamq('TEST23581023', 'yyyy-MM-dd').birthDate).toEqual(
      '2023-08-10',
    );
  });

  test('should return invalid date', () => {
    expect(extractBirthDateAndSexFromRamq('TEST23701023', 'yyyy-MM-dd').birthDate).toEqual(
      undefined,
    );
  });

  test('should return the good sex', () => {
    expect(extractBirthDateAndSexFromRamq('TEST55072223', 'yyyy-MM-dd').sex).toEqual('MALE');
    expect(extractBirthDateAndSexFromRamq('TEST55572223', 'yyyy-MM-dd').sex).toEqual('FEMALE');
  });
});
