import intl from 'react-intl-universal';
import { Form, FormItemProps, Space } from 'antd';
import { Rule } from 'antd/lib/form';
import { isValid } from 'date-fns';

import MaskedDateInput from 'components/Form/MaskedDateInput';

import styles from './index.module.scss';

export type InputDateFormItemProps = {
  formItemProps?: Omit<FormItemProps, 'getValueFromEvent' | 'rules'>;
  extra?: React.ReactNode;
  onValidate?: (valid: boolean, value: Date) => void;
  moreRules?: Rule[];
};

const InputDateFormItem = ({
  formItemProps,
  extra,
  onValidate,
  moreRules,
}: InputDateFormItemProps) => {
  let rules: Rule[] = [
    {
      required: formItemProps?.required,
      validator(_, value) {
        if (value && isValid(new Date(value.replaceAll(' ', '')))) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(intl.get('this.field.is.required')));
      },
      validateTrigger: 'onSubmit',
    },
  ];

  if (Array.isArray(moreRules) && moreRules.length > 0) {
    rules = rules.concat(moreRules);
  }

  return (
    <Form.Item noStyle>
      <Space style={{ position: 'relative' }}>
        <Form.Item {...formItemProps} getValueFromEvent={(e) => e.unmaskedValue} rules={rules}>
          <MaskedDateInput
            className={styles.maskedInputDate}
            onChange={(e) => {
              if (onValidate) {
                const date = new Date(e.unmaskedValue);
                onValidate(isValid(date), date);
              }
            }}
          />
        </Form.Item>
        <div style={{ position: 'absolute', top: '5px', left: '11.5em', width: '20em' }}>
          {extra}
        </div>
      </Space>
    </Form.Item>
  );
};

export default InputDateFormItem;
