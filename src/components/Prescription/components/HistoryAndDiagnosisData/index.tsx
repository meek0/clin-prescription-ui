import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Button, Checkbox, Form, Input, Radio, Select, Space } from 'antd';
import { HybridAnalysis } from 'api/hybrid/models';
import cx from 'classnames';
import { isEmpty } from 'lodash';

import { defaultFormItemsRules } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import {
  checkShouldUpdate,
  getFieldValue,
  getNamePath,
  resetFieldError,
  setFieldValue,
  setInitialValues,
} from 'components/Prescription/utils/form';
import { IAnalysisFormPart, IGetNamePathParams } from 'components/Prescription/utils/type';
import { usePrescriptionFormConfig } from 'store/prescription';

import { IHistoryAndDiagnosisDataType } from './types';

import styles from './index.module.css';

type OwnProps = IAnalysisFormPart & {
  initialData?: IHistoryAndDiagnosisDataType;
};

const hiddenLabelConfig = { colon: false, label: <></> };

const HistoryAndDiagnosticData = ({ parentKey, form, initialData }: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);
  const [canAddHealthCondition, setCanAddHealthCondition] = useState(false);

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      setInitialValues(form, getName, initialData);
      if (!initialData.history?.length) {
        setDefaultCondition();
      } else {
        const initialHealthConditions = initialData.history;
        const lastInitialHealthConditionsItem =
          initialHealthConditions[initialHealthConditions.length - 1];

        setCanAddHealthCondition(
          !!lastInitialHealthConditionsItem?.condition &&
            !!lastInitialHealthConditionsItem.parental_link_code,
        );
      }
    } else {
      setDefaultCondition();
      setFieldValue(
        form,
        getName('inbreeding' satisfies keyof IHistoryAndDiagnosisDataType),
        undefined,
      );
    }
    // eslint-disable-next-line
  }, []);

  const setDefaultCondition = () =>
    setFieldValue(form, getName('history' satisfies keyof IHistoryAndDiagnosisDataType), [
      {
        condition: '',
        parental_link_code: undefined,
      },
    ]);

  const resetListError = () => {
    resetFieldError(form, getName('history' satisfies keyof IHistoryAndDiagnosisDataType));

    const formFieldValueItems = getFieldValue(
      form,
      getName('history' satisfies keyof IHistoryAndDiagnosisDataType),
    );

    if (Array.isArray(formFieldValueItems) && formFieldValueItems.length > 0) {
      const lastItem = formFieldValueItems[formFieldValueItems.length - 1];
      setCanAddHealthCondition(!!lastItem?.condition && !!lastItem.parental_link_code);
    } else {
      setCanAddHealthCondition(false);
    }
  };

  const canRemoveHealthConditionFormItem = (formItemPosition: number) => {
    const formFieldValueItems = form.getFieldValue(
      getName('history' satisfies keyof IHistoryAndDiagnosisDataType),
    );

    if (Array.isArray(formFieldValueItems) && formItemPosition === 0) {
      return formFieldValueItems[0]?.condition || formFieldValueItems[0]?.parental_link_code;
    } else {
      const previousPosition = formItemPosition - 1;
      return (
        previousPosition >= 0 &&
        (formFieldValueItems[previousPosition]?.condition ||
          formFieldValueItems[previousPosition]?.parental_link_code)
      );
    }
  };

  const isTheOnlyOne = (formItemPosition: number) => {
    const formFieldValueItems = getFieldValue(
      form,
      getName('history' satisfies keyof IHistoryAndDiagnosisDataType),
    );

    return (
      Array.isArray(formFieldValueItems) &&
      formItemPosition === 0 &&
      formFieldValueItems.length === 1
    );
  };

  return (
    <div className={styles.historyAndDiagnosisHypSelect}>
      <Form.Item>
        <Form.Item
          label={intl.get('prescription.history.diagnosis.review.label.family.history')}
          name={getName('report_health_conditions' satisfies keyof IHistoryAndDiagnosisDataType)}
          valuePropName="checked"
          className="noMarginBtm"
        >
          <Checkbox>{intl.get('prescription.history.diagnosis.report.health.conditions')}</Checkbox>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prev, next) =>
            checkShouldUpdate(prev, next, [
              getName('report_health_conditions' satisfies keyof IHistoryAndDiagnosisDataType),
            ])
          }
        >
          {({ getFieldValue }) =>
            getFieldValue(
              getName('report_health_conditions' satisfies keyof IHistoryAndDiagnosisDataType),
            ) ? (
              <Form.Item className={cx('noMarginBtm', styles.healthConditionsWrapper)}>
                <Form.Item {...hiddenLabelConfig} className="noMarginBtm">
                  <ProLabel
                    title={intl.get('prescription.history.diagnosis.report.health.conditions')}
                    colon
                    requiredMark
                    size="small"
                  />
                </Form.Item>
                <Form.List
                  name={getName('history' satisfies keyof IHistoryAndDiagnosisDataType)}
                  rules={[
                    {
                      validator: async (_, conditions: HybridAnalysis['history']) => {
                        if (
                          !conditions.some(
                            (condition) => condition.condition && condition.parental_link_code,
                          )
                        ) {
                          return Promise.reject(
                            new Error(
                              intl.get(
                                'prescription.history.diagnosis.report.health.conditions.error',
                              ),
                            ),
                          );
                        }
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      <div className={cx(errors.length ? styles.listErrorWrapper : '')}>
                        {fields.map(({ key, name, ...restField }) => (
                          <Form.Item key={key} {...hiddenLabelConfig} className="noMarginBtm">
                            <Space
                              key={key}
                              className={styles.healthConditionListItem}
                              align="baseline"
                            >
                              <Form.Item
                                {...restField}
                                rules={key > 0 ? defaultFormItemsRules : undefined}
                                name={[
                                  name,
                                  'condition' satisfies keyof HybridAnalysis['history'][0],
                                ]}
                              >
                                <Input
                                  placeholder={intl.get(
                                    'prescription.history.diagnosis.report.health.condition.placeholder',
                                  )}
                                  onChange={resetListError}
                                />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                rules={key > 0 ? defaultFormItemsRules : undefined}
                                name={[
                                  name,
                                  'parental_link_code' satisfies keyof HybridAnalysis['history'][0],
                                ]}
                              >
                                <Select
                                  placeholder={intl.get(
                                    'prescription.history.diagnosis.report.health.condition.parentalLink',
                                  )}
                                  onChange={resetListError}
                                >
                                  {formConfig?.history_and_diagnosis.parental_links.map((link) => (
                                    <Select.Option key={link.value} value={link.value} title={null}>
                                      {link.name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <CloseOutlined
                                className={cx(
                                  !canRemoveHealthConditionFormItem(name) ? styles.hidden : '',
                                  styles.removeIcon,
                                )}
                                onClick={() => {
                                  if (isTheOnlyOne(name)) {
                                    setDefaultCondition();
                                    setCanAddHealthCondition(false);
                                  } else {
                                    setCanAddHealthCondition(true);
                                    remove(name);
                                  }
                                }}
                              />
                            </Space>
                          </Form.Item>
                        ))}
                      </div>
                      <Form.Item noStyle>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                      {
                        <Form.Item {...hiddenLabelConfig} className="noMarginBtm">
                          <Button
                            type="link"
                            disabled={!canAddHealthCondition}
                            className={styles.addHealthCondition}
                            onClick={() => {
                              setCanAddHealthCondition(false);
                              add({ condition: '', parental_link: undefined });
                            }}
                            icon={<PlusOutlined />}
                          >
                            {intl.get('prescription.history.diagnosis.add.health.conditions')}
                          </Button>
                        </Form.Item>
                      }
                    </>
                  )}
                </Form.List>
              </Form.Item>
            ) : null
          }
        </Form.Item>
      </Form.Item>
      <Form.Item
        label={intl.get('prescription.history.diagnosis.review.label.inbreeding')}
        name={getName('inbreeding' satisfies keyof IHistoryAndDiagnosisDataType)}
      >
        <Radio.Group>
          <Radio value={false}>{intl.get('no')}</Radio>
          <Radio value={true}>{intl.get('yes')}</Radio>
          <Radio value={undefined}>NA</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label={intl.get('prescription.history.diagnosis.review.label.ethnicity')}
        name={getName('ethnicity_codes' satisfies keyof IHistoryAndDiagnosisDataType)}
        className={styles.ethnicities}
      >
        <Select
          placeholder={intl.get('prescription.add.parent.modal.select')}
          mode="multiple"
          onChange={() =>
            resetFieldError(
              form,
              getName('ethnicity_codes' satisfies keyof IHistoryAndDiagnosisDataType),
            )
          }
        >
          {formConfig?.history_and_diagnosis.ethnicities.map((eth) => (
            <Select.Option key={eth.value} value={eth.value} title={null}>
              {eth.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label={intl.get('prescription.history.diagnosis.review.label.hypothesis')}
        name={getName('diagnosis_hypothesis' satisfies keyof IHistoryAndDiagnosisDataType)}
        rules={defaultFormItemsRules}
        className="noMarginBtm"
      >
        <Input.TextArea rows={3} placeholder="Indications" data-cy="InputHypothesis" />
      </Form.Item>
    </div>
  );
};

export default HistoryAndDiagnosticData;
