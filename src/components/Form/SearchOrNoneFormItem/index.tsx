import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import {
  Checkbox,
  CheckboxProps,
  Form,
  FormInstance,
  FormItemProps,
  Input,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import { SearchProps } from 'antd/lib/input';
import { ApiResponse } from 'api';
import cx from 'classnames';
import { get } from 'lodash';

import { resetFieldError, setFieldError } from 'components/Prescription/utils/form';

import styles from './index.module.css';

export interface ISearchOrNoneFormItemProps<TSearchResult> {
  form: FormInstance;
  inputFormItemProps: FormItemProps & { name: NamePath };
  checkboxFormItemProps: Omit<
    FormItemProps & { name: NamePath; title: string },
    'label' | 'valuePropName'
  >;
  inputProps?: Omit<SearchProps, 'disabled'> & {
    onSearch?: (value: string, search: (value: string) => void) => void;
  };
  checkboxProps?: Omit<CheckboxProps, 'disabled'>;
  onReset?: () => void;
  onSearchDone: (result: TSearchResult | undefined, searchValue?: string) => void;
  apiPromise: (value: string) => Promise<ApiResponse<TSearchResult>>;
  disabled?: boolean;
  disableReset?: boolean;
  autoTriggerSearch?: string;
  noReset?: boolean;
}

const SearchOrNoneFormItem = <TSearchResult,>({
  form,
  inputFormItemProps,
  checkboxFormItemProps,
  inputProps,
  checkboxProps,
  onReset,
  onSearchDone,
  apiPromise,
  disabled = false,
  disableReset = false,
  autoTriggerSearch,
  noReset,
}: ISearchOrNoneFormItemProps<TSearchResult>) => {
  const checkboxName = checkboxFormItemProps.name;
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(disabled);
  const [showCheckboxTooltip, setShowCheckboxTooltip] = useState(false);

  useEffect(() => {
    if (disabled !== isDisabled) {
      setIsDisabled(disabled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  const processSearch = (value: string) => {
    resetFieldError(form, inputFormItemProps.name);

    if (!value) {
      setFieldError(form, inputFormItemProps.name, intl.get('this.field.is.required'));
    } else {
      setIsLoading(true);
      apiPromise(value)
        .then(({ data }) => {
          onSearchDone(data, value);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (autoTriggerSearch) {
      onSearch(autoTriggerSearch);
    }
  }, [autoTriggerSearch]);

  const handleReset = () => {
    form.resetFields([inputFormItemProps.name, checkboxFormItemProps.name]);
    setIsDisabled(false);
    if (onReset) {
      onReset();
    }
  };

  const onSearch = (value: string) => {
    if (inputProps?.onSearch) {
      inputProps.onSearch(value, processSearch);
    } else {
      processSearch(value);
    }
  };
  return (
    <>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          get(prevValues, checkboxName) !== get(currentValues, checkboxName)
        }
      >
        {({ getFieldValue }) =>
          !getFieldValue(checkboxName) ? (
            <Form.Item className={styles.noMargin}>
              <Space>
                <Form.Item
                  {...inputFormItemProps}
                  className={cx(styles.noMargin, inputFormItemProps.className)}
                >
                  <Input.Search
                    {...inputProps}
                    className={cx(styles.searchInput, inputProps?.className)}
                    enterButton
                    disabled={isDisabled}
                    onPressEnter={(e) => {
                      const target = e.target as HTMLInputElement;
                      onSearch(target.value);
                      e.preventDefault();
                    }}
                    onSearch={(value) => onSearch(value)}
                    loading={isLoading}
                  />
                </Form.Item>
                {isDisabled && !noReset && (
                  <Tooltip
                    title={
                      disableReset ? intl.get('prescriptionForm.patient.reset.disabledTooltip') : ''
                    }
                  >
                    <Typography.Link
                      disabled={disableReset}
                      className={styles.resetLink}
                      onClick={handleReset}
                    >
                      {intl.get('sharing.filter.actions.reset')}
                    </Typography.Link>
                  </Tooltip>
                )}
              </Space>
            </Form.Item>
          ) : null
        }
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          get(prevValues, checkboxName) !== get(currentValues, checkboxName)
        }
      >
        {({ getFieldValue }) => (
          <Form.Item
            {...checkboxFormItemProps}
            label={getFieldValue(checkboxName) ? inputFormItemProps.label : <></>}
            className={cx(
              getFieldValue(checkboxName) ? '' : styles.hideLabel,
              checkboxFormItemProps.className,
            )}
            valuePropName="checked"
            required={inputFormItemProps.required}
          >
            <Checkbox
              {...checkboxProps}
              disabled={isDisabled}
              onChange={(e) => {
                if (!e.target.checked) {
                  handleReset();
                }
              }}
              onMouseEnter={() => setShowCheckboxTooltip(true)}
              onMouseLeave={() => setShowCheckboxTooltip(false)}
            >
              <Tooltip
                title={isDisabled ? intl.get('prescriptionForm.patient.reset.disabledTooltip') : ''}
                open={isDisabled && showCheckboxTooltip}
                align={{
                  offset: [-40, 0],
                }}
              >
                {checkboxFormItemProps.title}
              </Tooltip>
            </Checkbox>
          </Form.Item>
        )}
      </Form.Item>
    </>
  );
};

export default SearchOrNoneFormItem;
