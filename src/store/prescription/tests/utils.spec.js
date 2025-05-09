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
        not_observed_signs: [
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
        not_observed_signs: [
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
      type: 'GERMLINE',
      analysis_code: undefined,
      is_reflex: undefined,
      inbreeding: undefined,
      comment: undefined,
      resident_supervisor_id: undefined,
      history: [],
      diagnosis_hypothesis: undefined,
      ethnicity_codes: undefined,
      patients: [
        {
          first_name: undefined,
          last_name: undefined,
          jhn: 'XXXX00001111',
          mrn: undefined,
          sex: undefined,
          birth_date: undefined,
          organization_id: undefined,
          family_member: 'PROBAND',
          clinical: {
            comment: undefined,
            signs: [
              {
                age_code: undefined,
                code: undefined,
                observed: true,
              },
              {
                age_code: undefined,
                code: undefined,
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
        undefined,
        undefined,
      ],
    };

    expect(cleanAnalysisData(payload)).toEqual(expected);
  });
});
