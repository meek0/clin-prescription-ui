import { Fragment } from 'react';
import intl from 'react-intl-universal';
import Empty from '@ferlab/ui/core/components/Empty';
import { Descriptions, Typography } from 'antd';

import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import {
  IParaclinicalExamItem,
  PARACLINICAL_EXAM_ITEM_KEY,
  PARACLINICAL_EXAMS_FI_KEY,
  ParaclinicalExamStatus,
} from 'components/Prescription/components/ParaclinicalExamsSelect';
import { usePrescriptionForm, usePrescriptionFormConfig } from 'store/prescription';

const ParaclinicalExamsReview = () => {
  const { analysisData } = usePrescriptionForm();
  const formConfig = usePrescriptionFormConfig();

  formConfig?.paraclinical_exams;

  const getData = (key: PARACLINICAL_EXAMS_FI_KEY) =>
    analysisData[STEPS_ID.PARACLINICAL_EXAMS]?.[key] || [];

  const getExamNameByCode = (code: string) =>
    formConfig?.paraclinical_exams.default_list.find((exam) => exam.value === code)?.name;

  const getFormattedValue = (exam: IParaclinicalExamItem) => {
    if (exam.value) {
      // TODO Hard coded right now.
      // Should come from the config
      return `${exam.value} UI/L`;
    }

    const examDefaultValues = formConfig?.paraclinical_exams.default_list.find(
      (d) => d.value === exam.code,
    );

    return (
      <Fragment>
        {exam.values
          .map(
            (value) =>
              examDefaultValues?.extra?.options?.find((option) => option.value === value)?.name,
          )
          .join(', ')}
      </Fragment>
    );
  };

  const selectedExams = (
    getData(PARACLINICAL_EXAMS_FI_KEY.EXAMS) as IParaclinicalExamItem[]
  ).filter(
    (exam) => exam[PARACLINICAL_EXAM_ITEM_KEY.INTERPRETATION] !== ParaclinicalExamStatus.NOT_DONE,
  );

  return (
    <Fragment>
      {selectedExams.length ? (
        <Descriptions className="label-20" column={1} size="small">
          {selectedExams.map((exam, index) => (
            <Descriptions.Item
              key={index}
              label={getExamNameByCode(exam[PARACLINICAL_EXAM_ITEM_KEY.CODE])}
            >
              <Typography.Text>
                {intl.get(exam[PARACLINICAL_EXAM_ITEM_KEY.INTERPRETATION])}
                {exam[PARACLINICAL_EXAM_ITEM_KEY.INTERPRETATION] ===
                  ParaclinicalExamStatus.ABNORMAL && (
                  <Fragment>
                    {' '}
                    <Typography.Text>:</Typography.Text> {getFormattedValue(exam)}
                  </Fragment>
                )}
              </Typography.Text>
            </Descriptions.Item>
          ))}
        </Descriptions>
      ) : (
        <Empty
          showImage={false}
          align="left"
          description={intl.get('prescription.patient.review.no.data.for.this.section')}
          noPadding
        />
      )}
    </Fragment>
  );
};

export default ParaclinicalExamsReview;
