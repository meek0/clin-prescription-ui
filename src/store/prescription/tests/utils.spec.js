import { cleanAnalysisData } from '../utils';

describe('cleanAnalysisData', () => {
  test('Should remove NA from sign', () => {
    const payload = {
      paraclinical_exams: {
        exams: [
          {
            interpretation: 'not_done',
          },
          {
            interpretation: 'abnormal',
          },
        ],
      },
      clinical_signs: {
        signs: [
          {
            is_observed: 'NA',
          },
          {
            is_observed: true,
          },
          {
            is_observed: false,
          },
        ],
      },
      patient: {
        ramq: 'XXXX 0000 1111',
        additional_info: {
          mother_ramq: 'XXXX 0000 1111',
        },
      },
      mother: {
        ramq: 'XXXX 0000 1111',
        signs: [
          {
            is_observed: 'NA',
          },
          {
            is_observed: false,
          },
        ],
      },
      father: {
        ramq: 'XXXX 0000 1111',
        signs: [
          {
            is_observed: 'NA',
          },
          {
            is_observed: true,
          },
        ],
      },
    };

    const expected = {
      paraclinical_exams: {
        exams: [
          {
            interpretation: 'abnormal',
          },
        ],
      },
      clinical_signs: {
        signs: [
          {
            is_observed: true,
          },
          {
            is_observed: false,
          },
        ],
      },
      patient: {
        ramq: 'XXXX00001111',
        additional_info: {
          mother_ramq: 'XXXX00001111',
        },
      },
      mother: {
        ramq: 'XXXX00001111',
        signs: [
          {
            is_observed: false,
          },
        ],
      },
      father: {
        ramq: 'XXXX00001111',
        signs: [
          {
            is_observed: true,
          },
        ],
      },
    };

    expect(cleanAnalysisData(payload)).toEqual(expected);
  });
});
