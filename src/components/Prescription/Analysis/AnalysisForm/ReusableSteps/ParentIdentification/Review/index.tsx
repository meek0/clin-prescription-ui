/* eslint-disable max-len */
import intl from 'react-intl-universal';
import { Descriptions, Divider } from 'antd';

import ClinicalSignsReview from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/ClinicalSigns/Review/';
import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import {
  ClinicalStatusValue,
  EnterInfoMomentValue,
  TParentDataType,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/ParentIdentification/types';
import PatientIdentificationReview from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/PatientIdentification/Review';
import EmptySection from 'components/Prescription/components/EmptySection';
import { usePrescriptionForm } from 'store/prescription';

interface OwnProps {
  parentKey: STEPS_ID.MOTHER_IDENTIFICATION | STEPS_ID.FATHER_IDENTIFICATION;
}

const ParentIdentificationReview = ({ parentKey }: OwnProps) => {
  const { analysisFormData } = usePrescriptionForm();

  const parent = analysisFormData[parentKey];
  const isPrenatal = analysisFormData.proband?.foetus?.is_prenatal_diagnosis;

  if (parent?.status === EnterInfoMomentValue.NOW) {
    const isAffected =
      (parent as TParentDataType).parent_clinical_status === ClinicalStatusValue.AFFECTED;

    return (
      <>
        {(!isPrenatal || parentKey === STEPS_ID.FATHER_IDENTIFICATION) && (
          <>
            <PatientIdentificationReview key={parentKey} stepId={parentKey} />
            <Divider style={{ margin: '12px 0' }} />
          </>
        )}

        <Descriptions className="label-20" column={1} size="small">
          <Descriptions.Item
            label={intl.get('status')}
            style={isAffected ? { paddingBottom: '8px' } : undefined}
          >
            {intl.get(parent.parent_clinical_status.toLowerCase() ?? '')}
          </Descriptions.Item>
        </Descriptions>
        {isAffected && <ClinicalSignsReview patientKey={parentKey} />}
      </>
    );
  }

  if (parent?.reason) {
    return (
      <Descriptions className="label-20" key={parentKey}>
        <Descriptions.Item
          label={
            parent?.status === EnterInfoMomentValue.NEVER
              ? intl.get('prescription.parent.identification.review.permanent.absence')
              : intl.get('prescription.parent.identification.review.temporary.absence')
          }
        >
          {parent?.reason}
        </Descriptions.Item>
      </Descriptions>
    );
  }

  return <EmptySection />;
};

export default ParentIdentificationReview;
