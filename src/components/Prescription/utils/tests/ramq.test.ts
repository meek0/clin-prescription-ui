import { extractBirthDateAndSexFromJhn } from '../ramq';

describe('extract ramq', () => {
  test('should not be in the futur', () => {
    expect(extractBirthDateAndSexFromJhn('TEST55072223', 'yyyy-MM-dd').birthDate).toEqual(
      '1955-07-22',
    );
    expect(extractBirthDateAndSexFromJhn('TEST23581023', 'yyyy-MM-dd').birthDate).toEqual(
      '2023-08-10',
    );
  });

  test('should return invalid date', () => {
    expect(extractBirthDateAndSexFromJhn('TEST23701023', 'yyyy-MM-dd').birthDate).toEqual(
      undefined,
    );
  });

  test('should return the good sex', () => {
    expect(extractBirthDateAndSexFromJhn('TEST55072223', 'yyyy-MM-dd').sex).toEqual('MALE');
    expect(extractBirthDateAndSexFromJhn('TEST55572223', 'yyyy-MM-dd').sex).toEqual('FEMALE');
  });
});
