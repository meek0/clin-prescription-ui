import { commonPrescriptionFilterFields, getPrescriptionStatusDictionnary } from '../constant';

describe('getPrescriptionStatusDictionnary', () => {
  test('should be robust', () => {
    expect(getPrescriptionStatusDictionnary()).toBeDefined();
  });
});

describe('commonPrescriptionFilterFields', () => {
  test('should be robust', () => {
    expect(commonPrescriptionFilterFields.length).toEqual(9);
  });
});
