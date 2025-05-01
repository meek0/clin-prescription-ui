import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { InfoCircleOutlined } from '@ant-design/icons';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Form, Input, Radio, Select, Space, Tag } from 'antd';
import { IParaclinicalExamItemExtra } from 'api/form/models';
import cx from 'classnames';

import { defaultFormItemsRules } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { getNamePath, setInitialValues } from 'components/Prescription/utils/form';
import { IAnalysisFormPart, IGetNamePathParams } from 'components/Prescription/utils/type';
import { usePrescriptionFormConfig } from 'store/prescription';

import {
  IParaclinicalExamItem,
  IParaclinicalExamMultiSelectExtra,
  IParaclinicalExamsDataType,
  IParaclinicalExamSimpleInputExtra,
  ParaclinicalExamStatus,
} from './types';

import styles from './index.module.css';

type OwnProps = IAnalysisFormPart & {
  initialData?: IParaclinicalExamsDataType;
};

const ParaclinicalExamsSelect = ({ form, parentKey, initialData }: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);

  useEffect(() => {
    setInitialValues(form, getName, {
      exams: (formConfig?.paraclinical_exams.default_list ?? []).map((exam) => {
        const foundExam = initialData?.exams.find((item) => item.code === exam.value);
        return {
          code: exam.value,
          interpretation: foundExam?.interpretation || ParaclinicalExamStatus.NOT_DONE,
          values: foundExam?.values || [],
          value:
            exam.extra?.type === 'multi_select'
              ? undefined
              : foundExam?.value || foundExam?.values?.[0],
        } as IParaclinicalExamItem;
      }),
      other: initialData?.other,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildExtra = (extra: IParaclinicalExamItemExtra | undefined) => {
    if (extra) {
      if (extra.type === 'string' && extra.required) {
        // eslint-disable-next-line
        return (name: number) => (<SimpleInputExtra name={name} label={extra.label} />);
      }

      if (extra.type === 'multi_select') {
        // eslint-disable-next-line
        return (name: number) => (<MultiSelectExtra name={name} label={extra.label} options={extra.options ?? []} required={extra.required} />);
      }
    }
  };

  return (
    <div className={styles.paraExamsSelect}>
      <Form.List name={getName('exams' satisfies keyof IParaclinicalExamsDataType)}>
        {(fields) =>
          fields.map(({ key, name, ...restField }) => {
            const exam = formConfig?.paraclinical_exams.default_list[name]!;
            const { name: title, tooltip } = exam;
            const extra = buildExtra(exam.extra);
            return (
              <div key={key} className={cx(styles.paraExamFormItem)}>
                <Space direction="vertical" className={styles.paraExamFormItemContent} size={5}>
                  <Form.Item
                    {...restField}
                    name={[name, 'interpretation' satisfies keyof IParaclinicalExamItem]}
                    label={title}
                    tooltip={tooltip ? { title: tooltip, icon: <InfoCircleOutlined /> } : null}
                  >
                    <Radio.Group>
                      <Radio value={ParaclinicalExamStatus.NOT_DONE}>
                        {intl.get('prescription.clinical_exam.status.not_done')}
                      </Radio>
                      <Radio value={ParaclinicalExamStatus.ABNORMAL}>{intl.get('abnormal')}</Radio>
                      <Radio value={ParaclinicalExamStatus.NORMAL}>{intl.get('normal')}</Radio>
                    </Radio.Group>
                  </Form.Item>
                  {extra && (
                    <Form.Item noStyle shouldUpdate>
                      {({ getFieldValue }) =>
                        getFieldValue(
                          getName(
                            'exams' satisfies keyof IParaclinicalExamsDataType,
                            name,
                            'interpretation' satisfies keyof IParaclinicalExamItem,
                          ),
                        ) === ParaclinicalExamStatus.ABNORMAL
                          ? extra(name)
                          : null
                      }
                    </Form.Item>
                  )}
                </Space>
              </div>
            );
          })
        }
      </Form.List>
      <Form.Item
        label={intl.get('prescription.clinical_exam.other_examination')}
        name={getName('other' satisfies keyof IParaclinicalExamsDataType)}
        className={cx(styles.otherExamsTextarea, 'noMarginBtm')}
      >
        <Input.TextArea
          rows={3}
          placeholder={intl.get('prescription.patient.paraclinical.exams.other.placeholder')}
        />
      </Form.Item>
    </div>
  );
};

const MultiSelectExtra = ({
  name,
  label,
  options,
  required,
}: IParaclinicalExamMultiSelectExtra) => (
  <Form.Item colon={false} label={<></>}>
    <ProLabel title={label || "Sélectionner tout ce qui s'applique"} colon size="small" />
    <Form.Item
      name={[name, 'values']}
      rules={required ? [{ ...defaultFormItemsRules[0], type: 'array', min: 1 }] : undefined}
    >
      <Select
        mode="multiple"
        placeholder="Sélectionner"
        tagRender={({ onClose, label }) => (
          <Tag className={styles.tag} closable onClose={onClose} style={{ marginRight: 3 }}>
            {label}
          </Tag>
        )}
      >
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value} title={null}>
            {option.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  </Form.Item>
);

const SimpleInputExtra = ({ name, label }: IParaclinicalExamSimpleInputExtra) => (
  <Form.Item wrapperCol={{ md: 12, lg: 12, xxl: 7 }} colon={false} label={<></>}>
    <ProLabel title={label || 'Sélectionner une valeur'} colon size="small" />
    <Form.Item name={[name, 'value']} rules={defaultFormItemsRules}>
      <Input />
    </Form.Item>
  </Form.Item>
);

export default ParaclinicalExamsSelect;
