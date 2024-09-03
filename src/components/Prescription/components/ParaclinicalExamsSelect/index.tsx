import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { InfoCircleOutlined } from '@ant-design/icons';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Form, Input, Radio, Select, Space, Tag } from 'antd';
import { IListNameValueItem, IParaclinicalExamItemExtra } from 'api/form/models';
import cx from 'classnames';
import { isEmpty } from 'lodash';

import { defaultFormItemsRules } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { getNamePath, setFieldValue, setInitialValues } from 'components/Prescription/utils/form';
import { IAnalysisFormPart, IGetNamePathParams } from 'components/Prescription/utils/type';
import { usePrescriptionFormConfig } from 'store/prescription';

import styles from './index.module.css';

type OwnProps = IAnalysisFormPart & {
  initialData?: IParaclinicalExamsDataType;
};

interface IParaclinicalExamSimpleInputExtra {
  name: number;
  label?: string;
}

interface IParaclinicalExamMultiSelectExtra extends IParaclinicalExamSimpleInputExtra {
  options: IListNameValueItem[];
  required: boolean;
}

export enum PARACLINICAL_EXAMS_FI_KEY {
  EXAMS = 'exams',
  OTHER_EXAMS = 'comment',
}

export enum PARACLINICAL_EXAM_ITEM_KEY {
  CODE = 'code',
  INTERPRETATION = 'interpretation',
}

export enum ParaclinicalExamStatus {
  NOT_DONE = 'not_done',
  ABNORMAL = 'abnormal',
  NORMAL = 'normal',
}

export interface IParaclinicalExamItem {
  [PARACLINICAL_EXAM_ITEM_KEY.INTERPRETATION]: string;
  [PARACLINICAL_EXAM_ITEM_KEY.CODE]: string;
  value?: string;
  values: string[];
}

export interface IParaclinicalExamsDataType {
  [PARACLINICAL_EXAMS_FI_KEY.EXAMS]: IParaclinicalExamItem[];
  [PARACLINICAL_EXAMS_FI_KEY.OTHER_EXAMS]?: string;
}

const ParaclinicalExamsSelect = ({ form, parentKey, initialData }: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      setInitialValues(form, getName, initialData, PARACLINICAL_EXAMS_FI_KEY);
    } else {
      setFieldValue(
        form,
        getName(PARACLINICAL_EXAMS_FI_KEY.EXAMS),
        (formConfig?.paraclinical_exams.default_list ?? []).map((exam) => ({
          [PARACLINICAL_EXAM_ITEM_KEY.CODE]: exam.value,
          [PARACLINICAL_EXAM_ITEM_KEY.INTERPRETATION]: ParaclinicalExamStatus.NOT_DONE,
        })),
      );
    }
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
      <Form.List name={getName(PARACLINICAL_EXAMS_FI_KEY.EXAMS)}>
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
                    name={[name, PARACLINICAL_EXAM_ITEM_KEY.INTERPRETATION]}
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
                            PARACLINICAL_EXAMS_FI_KEY.EXAMS,
                            name,
                            PARACLINICAL_EXAM_ITEM_KEY.INTERPRETATION,
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
        name={getName(PARACLINICAL_EXAMS_FI_KEY.OTHER_EXAMS)}
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
