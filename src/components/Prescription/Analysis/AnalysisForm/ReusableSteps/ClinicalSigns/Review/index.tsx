import intl from 'react-intl-universal';
import { Descriptions, Space } from 'antd';
import { isEmpty } from 'lodash';

import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { IClinicalSignItem } from 'components/Prescription/components/ClinicalSignsSelect/types';
import { usePrescriptionForm, usePrescriptionFormConfig } from 'store/prescription';

const ClinicalSignsReview = () => {
  const formConfig = usePrescriptionFormConfig();
  const { analysisFormData } = usePrescriptionForm();

  const getSignsByStatus = (isObserved: Boolean) =>
    analysisFormData.proband_clinical?.observed_signs.filter(
      (signs) => signs.observed === isObserved,
    ) || [];

  const formatSignsWithAge = (sign: IClinicalSignItem, index: number) => (
    <span key={index}>{`${sign.name} (${sign.code}) ${
      sign.observed && sign.age_code
        ? ' - ' +
          formConfig?.clinical_signs.onset_age.find((age) => age.value === sign.age_code)?.name
        : ''
    }`}</span>
  );

  const getObservedSignsList = () => {
    const observedSigns = getSignsByStatus(true);
    return isEmpty(observedSigns)
      ? EMPTY_FIELD
      : observedSigns.filter((sign) => sign.observed != null).map(formatSignsWithAge);
  };

  const getNotObservedSignsList = () => {
    const notObservedSigns = getSignsByStatus(false);
    return isEmpty(notObservedSigns)
      ? EMPTY_FIELD
      : analysisFormData.proband_clinical?.not_observed_signs?.map(formatSignsWithAge);
  };

  const getClinicalSignsRemark = () => {
    const remark = analysisFormData.proband_clinical?.comment ?? EMPTY_FIELD;
    return isEmpty(remark.toString().trim()) ? EMPTY_FIELD : remark;
  };

  return (
    <Descriptions className="label-20" column={1} size="small">
      <Descriptions.Item label={intl.get('prescription.clinical.signs.review.label.observed')}>
        <Space direction="vertical" size={0}>
          {getObservedSignsList()}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescription.clinical.signs.review.label.not.observed')}>
        <Space direction="vertical" size={0}>
          {getNotObservedSignsList()}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescription.clinical.signs.review.label.note')}>
        <>{getClinicalSignsRemark()}</>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ClinicalSignsReview;
