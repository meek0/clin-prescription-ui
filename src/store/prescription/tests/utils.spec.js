import { getAnalysisFromFormData } from '../utils';

describe('cleanAnalysisData', () => {
  test('Should remove NA from sign', () => {
    const payload = {
      proband_paraclinical: {
        exams: [
          {
            interpretation: 'NOT_DONE',
          },
          {
            interpretation: 'ABNORMAL',
          },
        ],
      },
      proband_clinical: {
        observed_signs: [
          {
            observed: true,
          },
        ],
        not_observed_signs: [
          {
            observed: false,
          },
        ],
      },
      proband: {
        jhn: 'XXXX 0000 1111',
        foetus: {
          mother_jhn: 'XXXX 0000 1111',
        },
      },
      mother: {
        jhn: 'XXXX 0000 1111',
        parent_clinical_status: 'affected',
        observed_signs: [
          {
            observed: true,
          },
        ],
        not_observed_signs: [
          {
            observed: false,
          },
        ],
      },
      father: {
        jhn: 'XXXX 0000 1111',
        parent_clinical_status: 'affected',
        observed_signs: [
          {
            observed: true,
          },
        ],
      },
    };

    const expected = {
      type: 'GERMLINE',
      analysis_code: undefined,
      is_reflex: undefined,
      comment: undefined,
      resident_supervisor_id: undefined,
      history: [],
      patients: [
        {
          jhn: 'XXXX00001111',
          family_member: 'PROBAND',
          foetus: {
            mother_jhn: 'XXXX00001111',
          },
          clinical: {
            comment: undefined,
            signs: [
              {
                observed: true,
              },
              {
                observed: false,
              },
            ],
          },
          para_clinical: {
            exams: [
              {
                code: undefined,
                interpretation: 'ABNORMAL',
                values: undefined,
              },
            ],
            other: undefined,
          },
        },
        {
          family_member: 'MOTHER',
          jhn: 'XXXX00001111',
          affected: true,
          clinical: {
            comment: undefined,
            signs: [
              {
                observed: true,
              },
              {
                observed: false,
              },
            ],
          },
        },
        {
          family_member: 'FATHER',
          jhn: 'XXXX00001111',
          affected: true,
          clinical: {
            comment: undefined,
            signs: [
              {
                observed: true,
              },
            ],
          },
        },
      ],
    };

    expect(getAnalysisFromFormData(payload)).toEqual(expected);
  });
});
