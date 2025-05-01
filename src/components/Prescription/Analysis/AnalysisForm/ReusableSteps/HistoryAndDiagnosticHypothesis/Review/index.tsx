import intl from 'react-intl-universal';
import { Descriptions } from 'antd';
import { HybridAnalysis } from 'api/hybrid/models';
import { isEmpty } from 'lodash';

import {
  EMPTY_FIELD,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { IHistoryAndDiagnosisDataType } from 'components/Prescription/components/HistoryAndDiagnosisData/types';
import { usePrescriptionForm, usePrescriptionFormConfig } from 'store/prescription';

const HistoryAndDiagnosisReview = () => {
  const { analysisFormData } = usePrescriptionForm();
  const formConfig = usePrescriptionFormConfig();
  const getData = (key: keyof IHistoryAndDiagnosisDataType) =>
    analysisFormData[STEPS_ID.HISTORY_AND_DIAGNOSIS]?.[key];

  const getHealthConditions = () => {
    const history = getData('history' satisfies keyof IHistoryAndDiagnosisDataType);
    return isEmpty(history)
      ? EMPTY_FIELD
      : (history as HybridAnalysis['history'])
          .map(
            (item) =>
              `${item.condition} (${
                formConfig?.history_and_diagnosis.parental_links.find(
                  (link) => link.value === item.parental_link_code,
                )?.name
              })`,
          )
          .join(', ');
  };

  const getHypothesisDiagnosis = () => {
    const hypothesis =
      getData('diagnosis_hypothesis' satisfies keyof IHistoryAndDiagnosisDataType) ?? EMPTY_FIELD;
    return isEmpty(hypothesis.toString().trim()) ? EMPTY_FIELD : hypothesis;
  };

  const ethnicities = formConfig?.history_and_diagnosis.ethnicities.reduce((ethnicities, eth) => {
    if (
      (
        getData('ethnicity_codes' satisfies keyof IHistoryAndDiagnosisDataType) as string[]
      )?.includes(eth.value)
    )
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
        {getData('inbreeding' satisfies keyof IHistoryAndDiagnosisDataType) === undefined
          ? EMPTY_FIELD
          : intl.get(
              getData('inbreeding' satisfies keyof IHistoryAndDiagnosisDataType) ? 'yes' : 'no',
            )}
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
