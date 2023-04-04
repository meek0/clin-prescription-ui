/* eslint-disable max-len */
import intl from 'react-intl-universal';
import { Descriptions, Divider } from 'antd';

import ClinicalSignsReview from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/ClinicalSigns/Review/';
import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import {
  ClinicalStatusValue,
  EnterInfoMomentValue,
  PARENT_DATA_FI_KEY,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/ParentIdentification';
import PatientIdentificationReview from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/PatientIdentification/Review';
import { usePrescriptionForm } from 'store/prescription';

interface OwnProps {
  parent: 'mother' | 'father';
}

const ParentIdentificationReview = ({ parent }: OwnProps) => {
  const { analysisData } = usePrescriptionForm();

  const getStepId = () =>
    parent === 'father' ? STEPS_ID.FATHER_IDENTIFICATION : STEPS_ID.MOTHER_IDENTIFICATION;

  const getData = (key: PARENT_DATA_FI_KEY) => analysisData[getStepId()]?.[key];

  if (getData(PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT) === EnterInfoMomentValue.NOW) {
    const status = getData(PARENT_DATA_FI_KEY.CLINICAL_STATUS);
    const isAffected = status === ClinicalStatusValue.AFFECTED;

    return (
      <>
        <PatientIdentificationReview key={parent} stepId={getStepId()} />
        <Divider style={{ margin: '12px 0' }} />
        <Descriptions className="label-20" column={1} size="small">
          <Descriptions.Item
            label={intl.get('status')}
            style={isAffected ? { paddingBottom: '8px' } : undefined}
          >
            {intl.get(status ?? '')}
          </Descriptions.Item>
        </Descriptions>
        {isAffected && <ClinicalSignsReview key={parent} stepId={getStepId()} />}
      </>
    );
  }

  return (
    <Descriptions className="label-20">
      <Descriptions.Item
        label={
          getData(PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT) === EnterInfoMomentValue.NEVER
            ? intl.get('prescription.parent.identification.review.permanent.absence')
            : intl.get('prescription.parent.identification.review.temporary.absence')
        }
      >
        {getData(PARENT_DATA_FI_KEY.NO_INFO_REASON)}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ParentIdentificationReview;
