import intl from 'react-intl-universal';
import { Descriptions } from 'antd';
import { TFormConfig } from 'api/form/models';
import { HybridPatientExam, HybridPatientParaClinical } from 'api/hybrid/models';

type OwnProps = {
  paraClinical: HybridPatientParaClinical;
  prescriptionConfig?: TFormConfig;
};

export const Paraclinique = ({ paraClinical, prescriptionConfig }: OwnProps) => {
  function getExamValues(exam: HybridPatientExam) {
    const defaultList = prescriptionConfig?.paraclinical_exams?.default_list?.find(
      (entry: any) => entry.value === exam.code,
    );

    if (!defaultList) return { name: exam.code, values: exam.values };

    let values: string[] = [];

    // multi_select
    if (defaultList.extra?.type === 'multi_select') {
      values = exam.values.map(
        (value) =>
          defaultList?.extra?.options?.find((entry: any) => entry.value === value)?.name || value,
      );
    } else if (defaultList.extra?.type === 'string') {
      values = exam.values.map(
        (value) => value + (defaultList.extra?.unit ? ` ${defaultList.extra?.unit}` : ''),
      );
    }

    let name = defaultList.name || exam.code;
    if (defaultList.tooltip) name += ` (${defaultList.tooltip})`;

    return { name, values };
  }

  return (
    <Descriptions column={1} size="small" className="label-20">
      {paraClinical?.exams?.map((exam) => {
        const { name, values } = getExamValues(exam);
        return (
          <Descriptions.Item key={exam.code} label={name}>
            {intl.get(`screen.prescription.entity.paraclinique.${exam?.interpretation}`) +
              (exam.values.length ? ` : ${values.join(', ')}` : '')}
          </Descriptions.Item>
        );
      })}
      {paraClinical.other && (
        <Descriptions.Item
          key={'paraclinique-other'}
          label={intl.get('prescription.clinical_exam.other_examination')}
        >
          {paraClinical.other}
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};
