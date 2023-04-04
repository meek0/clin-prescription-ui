import intl from 'react-intl-universal';
import { Form, FormItemProps, Space } from 'antd';
import { isValid } from 'date-fns';

import MaskedDateInput from 'components/uiKit/input/MaskedDateInput';

import styles from './index.module.scss';

export type InputDateFormItemProps = {
  formItemProps?: Omit<FormItemProps, 'getValueFromEvent' | 'rules'>;
  extra?: React.ReactNode;
  onValidate?: (valid: boolean, value: Date) => void;
};

const InputDateFormItem = ({ formItemProps, extra, onValidate }: InputDateFormItemProps) => (
  <Form.Item noStyle>
    <Space>
      <Form.Item
        {...formItemProps}
        getValueFromEvent={(e) => e.unmaskedValue}
        rules={[
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
        ]}
      >
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
      <div>{extra}</div>
    </Space>
  </Form.Item>
);

export default InputDateFormItem;
