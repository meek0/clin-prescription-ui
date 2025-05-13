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
import { usePrescriptionForm, usePrescriptionFormConfig } from 'store/prescription';

const HistoryAndDiagnosisReview = () => {
  const { analysisData } = usePrescriptionForm();
  const formConfig = usePrescriptionFormConfig();
  const getData = (key: HISTORY_AND_DIAG_FI_KEY) =>
    analysisData[STEPS_ID.HISTORY_AND_DIAGNOSIS]?.[key];

  const getHealthConditions = () => {
    const conditions = getData(HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS);
    return isEmpty(conditions)
      ? EMPTY_FIELD
      : (conditions as IHealthConditionItem[])
          .map(
            (item) =>
              `${item.condition} (${
                formConfig?.history_and_diagnosis.parental_links.find(
                  (link) => link.value === item.parental_link,
                )?.name
              })`,
          )
          .join(', ');
  };

  const getHypothesisDiagnosis = () => {
    const hypothesis = getData(HISTORY_AND_DIAG_FI_KEY.DIAGNOSIS_HYPOTHESIS) ?? EMPTY_FIELD;
    return isEmpty(hypothesis.toString().trim()) ? EMPTY_FIELD : hypothesis;
  };

  const ethnicities = formConfig?.history_and_diagnosis.ethnicities.reduce((ethnicities, eth) => {
    if ((getData(HISTORY_AND_DIAG_FI_KEY.ETHNICITY) as string[])?.includes(eth.value))
      ethnicities.push(eth.name);
    return ethnicities;
  }, [] as string[]);

  return (
    <Descriptions className="label-20" column={1} size="small">
      <Descriptions.Item
        label={intl.get('prescription.history.diagnosis.review.label.family.history')}
      >
        {getHealthConditions()}
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescription.history.diagnosis.review.label.inbreeding')}>
        {getData(HISTORY_AND_DIAG_FI_KEY.HAS_INBREEDING) === undefined
          ? EMPTY_FIELD
          : intl.get(getData(HISTORY_AND_DIAG_FI_KEY.HAS_INBREEDING) ? 'yes' : 'no')}
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescription.history.diagnosis.review.label.ethnicity')}>
        {ethnicities?.length ? ethnicities.join(' | ') : EMPTY_FIELD}
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescription.history.diagnosis.review.label.hypothesis')}>
        <>{getHypothesisDiagnosis()}</>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default HistoryAndDiagnosisReview;
