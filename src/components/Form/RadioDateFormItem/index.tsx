import { Form, Radio, RadioProps } from 'antd';
import { Rule } from 'antd/lib/form';
import { NamePath } from 'antd/lib/form/interface';
import cx from 'classnames';

import InputDateFormItem, { InputDateFormItemProps } from '../InputDateFormItem';

import styles from './index.module.scss';

export interface IRadioDateFormItemProps {
  title: string;
  radioProps?: RadioProps;
  dateInputProps: InputDateFormItemProps;
  parentFormItemName: NamePath;
  moreDateRules?: Rule[];
}

const RadioDateFormItem = ({
  title,
  radioProps,
  dateInputProps,
  parentFormItemName,
  moreDateRules,
}: IRadioDateFormItemProps) => (
  <Form.Item noStyle shouldUpdate>
    {({ getFieldValue }) => {
      const isSelected = getFieldValue(parentFormItemName) === radioProps?.value;
      return (
        <div className={styles.radioBtnDateWrapper}>
          <Radio {...radioProps}>{title}</Radio>
          <Form.Item noStyle={!isSelected} className={styles.maskedDateInputFormItem}>
            {isSelected ? (
              <InputDateFormItem
                {...dateInputProps}
                formItemProps={{
                  ...dateInputProps.formItemProps,
                  className: cx(styles.noMargin, dateInputProps.formItemProps?.className),
                }}
                moreRules={moreDateRules}
              />
            ) : null}
          </Form.Item>
        </div>
      );
    }}
  </Form.Item>
);

export default RadioDateFormItem;
