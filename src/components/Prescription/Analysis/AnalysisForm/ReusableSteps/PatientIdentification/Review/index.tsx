import { Fragment } from 'react';
import intl from 'react-intl-universal';
import { Descriptions, Divider } from 'antd';
import { capitalize } from 'lodash';

import {
  EMPTY_FIELD,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { PATIENT_DATA_FI_KEY } from 'components/Prescription/components/PatientDataSearch';
import { usePrescriptionForm } from 'store/prescription';
import { calculateGestationalAgeFromDDM, calculateGestationalAgeFromDPA } from 'utils/age';

import { ADD_INFO_FI_KEY, additionalInfoKey, GestationalAgeValues } from '../AdditionalInformation';

interface OwnProps {
  stepId?:
    | STEPS_ID.FATHER_IDENTIFICATION
    | STEPS_ID.MOTHER_IDENTIFICATION
    | STEPS_ID.PATIENT_IDENTIFICATION;
}

const PatientIdentificationReview = ({ stepId = STEPS_ID.PATIENT_IDENTIFICATION }: OwnProps) => {
  const { analysisData } = usePrescriptionForm();

  const getData = (key: PATIENT_DATA_FI_KEY) => analysisData[stepId]?.[key];

  const getAdditionalInfo = () =>
    stepId === STEPS_ID.PATIENT_IDENTIFICATION
      ? analysisData[stepId]?.[additionalInfoKey]
      : undefined;

  const getFileNumber = () => {
    const fileNumber = getData(PATIENT_DATA_FI_KEY.FILE_NUMBER);
    const institution = getData(PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION);
    return fileNumber ? `${fileNumber} - ${institution}` : EMPTY_FIELD;
  };

  const getName = () => {
    const firstName = getData(PATIENT_DATA_FI_KEY.FIRST_NAME);
    const lastName = getData(PATIENT_DATA_FI_KEY.LAST_NAME);
    return `${lastName?.toString().toUpperCase()} ${capitalize(firstName?.toString())}`;
  };

  const getGestationalDate = () => {
    const addInfo = getAdditionalInfo();
    let date: number | undefined = undefined;

    if (addInfo?.[ADD_INFO_FI_KEY.GESTATIONAL_AGE] === GestationalAgeValues.DDM) {
      date = calculateGestationalAgeFromDDM(new Date(addInfo?.gestational_date!));
    } else if (addInfo?.[ADD_INFO_FI_KEY.GESTATIONAL_AGE] === GestationalAgeValues.DPA) {
      date = calculateGestationalAgeFromDPA(new Date(addInfo?.gestational_date!));
    }

    return date
      ? intl.get('x.weeks', {
          weeks: date,
        })
      : EMPTY_FIELD;
  };

  return (
    <Fragment>
      <Descriptions className="label-20" column={1} size="small">
        <Descriptions.Item label={intl.get('folder')}>{getFileNumber()}</Descriptions.Item>
        <Descriptions.Item
          label={intl.get(getAdditionalInfo()?.is_new_born ? 'mother.ramq' : 'ramq')}
        >
          {getAdditionalInfo()?.is_new_born
            ? getAdditionalInfo()?.mother_ramq
            : getData(PATIENT_DATA_FI_KEY.RAMQ_NUMBER) ?? EMPTY_FIELD}
        </Descriptions.Item>
        <Descriptions.Item label={intl.get('name')}>{getName()}</Descriptions.Item>
        <Descriptions.Item label={intl.get('birthdate')}>
          {getData(PATIENT_DATA_FI_KEY.BIRTH_DATE)}
        </Descriptions.Item>
        <Descriptions.Item label={intl.get('sex')}>
          {intl.get(`sex.${getData(PATIENT_DATA_FI_KEY.SEX)}`)}
        </Descriptions.Item>
      </Descriptions>
      {getAdditionalInfo()?.is_prenatal_diagnosis && (
        <Fragment>
          <Divider style={{ margin: '12px 0' }} />
          <Descriptions className="label-20" column={1} size="small">
            <Descriptions.Item label={intl.get('prescription.patient.identification.sexe.foetus')}>
              {intl.get(`sex.${getAdditionalInfo()?.foetus_gender!}`)}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get('prescription.patient.identification.gestational.age')}
            >
              {getGestationalDate()}
            </Descriptions.Item>
          </Descriptions>
        </Fragment>
      )}
    </Fragment>
  );
};

export default PatientIdentificationReview;
