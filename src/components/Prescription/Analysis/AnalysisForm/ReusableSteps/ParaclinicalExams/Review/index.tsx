import { Fragment } from 'react';
import intl from 'react-intl-universal';
import { Descriptions, Typography } from 'antd';
import { IListNameValueItem, IParaclinicalExamItemExtra } from 'api/form/models';

import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import EmptySection from 'components/Prescription/components/EmptySection';
import {
  IParaclinicalExamItem,
  IParaclinicalExamsDataType,
  ParaclinicalExamStatus,
} from 'components/Prescription/components/ParaclinicalExamsSelect/types';
import { usePrescriptionForm, usePrescriptionFormConfig } from 'store/prescription';

const ParaclinicalExamsReview = () => {
  const { analysisFormData } = usePrescriptionForm();
  const formConfig = usePrescriptionFormConfig();

  formConfig?.paraclinical_exams;

  const getData = (key: keyof IParaclinicalExamsDataType) =>
    analysisFormData[STEPS_ID.PROBAND_PARACLINICAL]?.[key] || [];

  const getDefaultExam = (exam: IParaclinicalExamItem) =>
    formConfig?.paraclinical_exams.default_list.find((d) => d.value === exam.code);

  const getFormattedValue = (
    exam: IParaclinicalExamItem,
    examDefaultValues:
      | (IListNameValueItem & {
          extra?: IParaclinicalExamItemExtra | undefined;
          tooltip?: string | undefined;
        })
      | undefined,
  ) => {
    if (exam.value) {
      return `${exam.value} ${examDefaultValues?.extra?.unit || ''}`;
    }

    return (
      <Fragment>
        {exam.values
          ?.map(
            (value) =>
              examDefaultValues?.extra?.options?.find((option) => option.value === value)?.name,
          )
          .join(', ')}
      </Fragment>
    );
  };

  const selectedExams = (
    getData('exams' satisfies keyof IParaclinicalExamsDataType) as IParaclinicalExamItem[]
  ).filter((exam) => exam.interpretation !== ParaclinicalExamStatus.NOT_DONE);

  return (
    <Fragment>
      {selectedExams.length ||
      getData('other' satisfies keyof IParaclinicalExamsDataType).length ? (
        <Descriptions className="label-20" column={1} size="small">
          {selectedExams.map((exam, index) => {
            const examDefaultValues = getDefaultExam(exam);
            return (
              <Descriptions.Item key={index} label={examDefaultValues?.name}>
                <Typography.Text>
                  {intl.get(exam.interpretation?.toLowerCase())}
                  {exam.interpretation === ParaclinicalExamStatus.ABNORMAL &&
                    (exam?.value || Array.isArray(exam?.values)) && (
                      <Fragment>
                        <Typography.Text>:</Typography.Text>{' '}
                        {getFormattedValue(exam, examDefaultValues)}
                      </Fragment>
                    )}
                </Typography.Text>
              </Descriptions.Item>
            );
          })}
          {getData('other' satisfies keyof IParaclinicalExamsDataType).length && (
            <Descriptions.Item
              key="otherExams"
              label={intl.get('prescription.clinical_exam.other_examination')}
            >
              <Typography.Text>
                {getData('other' satisfies keyof IParaclinicalExamsDataType).toString()}
              </Typography.Text>
            </Descriptions.Item>
          )}
        </Descriptions>
      ) : (
        <EmptySection />
      )}
    </Fragment>
  );
};

export default ParaclinicalExamsReview;
