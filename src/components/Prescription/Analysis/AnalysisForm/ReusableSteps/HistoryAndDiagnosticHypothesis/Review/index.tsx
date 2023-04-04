import intl from 'react-intl-universal';
import { Descriptions } from 'antd';
import { isEmpty } from 'lodash';

import {
  EMPTY_FIELD,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import {
  HISTORY_AND_DIAG_FI_KEY,
  IHealthConditionItem,
} from 'components/Prescription/components/HistoryAndDiagnosisData';
import { usePrescriptionForm } from 'store/prescription';

const HistoryAndDiagnosisReview = () => {
  const { analysisData } = usePrescriptionForm();

  const getData = (key: HISTORY_AND_DIAG_FI_KEY) =>
    analysisData[STEPS_ID.HISTORY_AND_DIAGNOSIS]?.[key];

  const getHealthConditions = () => {
    const conditions = getData(HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS);
    return isEmpty(conditions)
      ? EMPTY_FIELD
      : (conditions as IHealthConditionItem[])
          .map((item) => `${item.condition} (${item.parental_link})`)
          .join(', ');
  };

  return (
    <Descriptions className="label-20" column={1} size="small">
      <Descriptions.Item
        label={intl.get('prescription.history.diagnosis.review.label.family.history')}
      >
        {getHealthConditions()}
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescription.history.diagnosis.review.label.inbreeding')}>
        {getData(HISTORY_AND_DIAG_FI_KEY.HAS_INBREEDING) === undefined
          ? '--'
          : intl.get((getData(HISTORY_AND_DIAG_FI_KEY.HAS_INBREEDING) ? 'yes' : 'no') ?? 'no')}
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescription.history.diagnosis.review.label.ethnicity')}>
        {getData(HISTORY_AND_DIAG_FI_KEY.ETHNICITY) ?? EMPTY_FIELD}
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescription.history.diagnosis.review.label.hypothesis')}>
        {getData(HISTORY_AND_DIAG_FI_KEY.DIAGNOSIS_HYPOTHESIS)}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default HistoryAndDiagnosisReview;
