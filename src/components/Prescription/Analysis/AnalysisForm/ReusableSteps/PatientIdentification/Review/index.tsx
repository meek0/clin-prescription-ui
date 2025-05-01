import { Fragment } from 'react';
import intl from 'react-intl-universal';
import { Descriptions, Divider } from 'antd';
import { capitalize } from 'lodash';

import {
  EMPTY_FIELD,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { usePrescriptionForm } from 'store/prescription';
import { calculateGestationalAgeFromDDM, calculateGestationalAgeFromDPA } from 'utils/age';

import { GestationalAgeValues } from '../AdditionalInformation';

interface OwnProps {
  stepId?:
    | STEPS_ID.FATHER_IDENTIFICATION
    | STEPS_ID.MOTHER_IDENTIFICATION
    | STEPS_ID.PROBAND_IDENTIFICATION;
}

const PatientIdentificationReview = ({ stepId = STEPS_ID.PROBAND_IDENTIFICATION }: OwnProps) => {
  const { analysisFormData } = usePrescriptionForm();
  const patient = analysisFormData[stepId];

  const foetusInfos =
    stepId === STEPS_ID.PROBAND_IDENTIFICATION ? analysisFormData[stepId]?.foetus : undefined;

  const getFileNumber = () => {
    const fileNumber = patient?.mrn;
    const institution = patient?.organization_id;
    return fileNumber ? `${fileNumber} - ${institution}` : institution;
  };

  const getName = () => {
    const firstName = patient?.first_name;
    const lastName = patient?.last_name;
    return `${lastName?.toString().toUpperCase()} ${capitalize(firstName?.toString())}`;
  };

  const getGestationalDate = () => {
    let date: number | undefined = undefined;

    if (foetusInfos?.gestational_method === GestationalAgeValues.DDM) {
      date = calculateGestationalAgeFromDDM(new Date(foetusInfos?.gestational_date!));
    } else if (foetusInfos?.gestational_method === GestationalAgeValues.DPA) {
      date = calculateGestationalAgeFromDPA(new Date(foetusInfos?.gestational_date!));
    } else if (foetusInfos?.gestational_method === GestationalAgeValues.DEAD_FOETUS) {
      return intl.get('prescription.patient.identification.foetus.dead');
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
        <Descriptions.Item label={intl.get(foetusInfos?.is_new_born ? 'mother.ramq' : 'ramq')}>
          {foetusInfos?.is_new_born ? foetusInfos?.mother_jhn : patient?.jhn ?? EMPTY_FIELD}
        </Descriptions.Item>
        <Descriptions.Item label={intl.get('name')}>{getName()}</Descriptions.Item>
        <Descriptions.Item label={intl.get('birthdate')}>{patient?.birth_date}</Descriptions.Item>
        <Descriptions.Item label={intl.get('sex')}>
          {intl.get(`sex.${patient?.sex.toLowerCase()}`)}
        </Descriptions.Item>
      </Descriptions>
      {foetusInfos?.is_prenatal_diagnosis && (
        <Fragment>
          <Divider style={{ margin: '12px 0' }} />
          <Descriptions className="label-20" column={1} size="small">
            <Descriptions.Item label={intl.get('prescription.patient.identification.sexe.foetus')}>
              {intl.get(`sex.${foetusInfos?.sex.toLowerCase()}`)}
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
