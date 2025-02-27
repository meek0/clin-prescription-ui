import { getUserGuidelink } from '.';

describe('should return good link', () => {
  test('return fr link', () => {
    expect(getUserGuidelink('fr')).toEqual(
      'https://docs.qa.cqgc.hsj.rtss.qc.ca/#/fr/qlin_prescriptions/create_prescription',
    );
  });

  test('return en link', () => {
    expect(getUserGuidelink('en')).toEqual(
      'https://docs.qa.cqgc.hsj.rtss.qc.ca/#/qlin_prescriptions/create_prescription',
    );
  });
});
