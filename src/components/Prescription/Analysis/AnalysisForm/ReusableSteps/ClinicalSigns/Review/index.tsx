import intl from 'react-intl-universal';
import { Descriptions, Space } from 'antd';

import {
  EMPTY_FIELD,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import {
  IClinicalSignItem,
  IClinicalSignsDataType,
} from 'components/Prescription/components/ClinicalSignsSelect/types';
import { usePrescriptionForm, usePrescriptionFormConfig } from 'store/prescription';

interface OwnProps extends React.Attributes {
  patientKey:
    | STEPS_ID.PROBAND_IDENTIFICATION
    | STEPS_ID.MOTHER_IDENTIFICATION
    | STEPS_ID.FATHER_IDENTIFICATION;
}

const ClinicalSignsReview = ({ patientKey }: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const { analysisFormData } = usePrescriptionForm();

  const clinical: IClinicalSignsDataType =
    patientKey === STEPS_ID.PROBAND_IDENTIFICATION
      ? analysisFormData.proband_clinical!
      : analysisFormData[patientKey]!;

  const formatSigns = (list: IClinicalSignItem[], isObserved: boolean = false) => {
    const signs = list?.reduce((signs, sign, index) => {
      if (!isObserved || sign.observed) {
        signs.push(
          <span key={index}>{`${sign.name} (${sign.code}) ${
            sign.observed && sign.age_code
              ? ' - ' +
                formConfig?.clinical_signs.onset_age.find((age) => age.value === sign.age_code)
                  ?.name
              : ''
          }`}</span>,
        );
      }
      return signs;
    }, [] as JSX.Element[]);
    return signs?.length ? signs : EMPTY_FIELD;
  };

  return (
    <Descriptions className="label-20" column={1} size="small" key={`${patientKey}-review`}>
      <Descriptions.Item label={intl.get('prescription.clinical.signs.review.label.observed')}>
        <Space direction="vertical" size={0}>
          {formatSigns(clinical.observed_signs, true)}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescription.clinical.signs.review.label.not.observed')}>
        <Space direction="vertical" size={0}>
          {formatSigns(clinical.not_observed_signs)}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescription.clinical.signs.review.label.note')}>
        <>{clinical.comment?.toString().trim() || EMPTY_FIELD}</>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ClinicalSignsReview;
