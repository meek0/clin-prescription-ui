import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Button, Checkbox, Form, Input, Radio, Select, Space } from 'antd';
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

import styles from './index.module.css';

type OwnProps = IAnalysisFormPart & {
  initialData?: IHistoryAndDiagnosisDataType;
};

export enum HISTORY_AND_DIAG_FI_KEY {
  REPORT_HEALTH_CONDITIONS = 'report_health_conditions',
  HAS_INBREEDING = 'inbreeding',
  HEALTH_CONDITIONS = 'health_conditions',
  ETHNICITY = 'ethnicity',
  DIAGNOSIS_HYPOTHESIS = 'diagnostic_hypothesis',
}

export enum HEALTH_CONDITION_ITEM_KEY {
  CONDITION = 'condition',
  PARENTAL_LINK = 'parental_link',
}

export interface IHealthConditionItem {
  [HEALTH_CONDITION_ITEM_KEY.CONDITION]: string;
  [HEALTH_CONDITION_ITEM_KEY.PARENTAL_LINK]: string;
}

export interface IHistoryAndDiagnosisDataType {
  [HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS]: IHealthConditionItem[];
  [HISTORY_AND_DIAG_FI_KEY.REPORT_HEALTH_CONDITIONS]: boolean;
  [HISTORY_AND_DIAG_FI_KEY.ETHNICITY]: string;
  [HISTORY_AND_DIAG_FI_KEY.HAS_INBREEDING]: boolean | undefined;
  [HISTORY_AND_DIAG_FI_KEY.DIAGNOSIS_HYPOTHESIS]: string;
}

const hiddenLabelConfig = { colon: false, label: <></> };

const HistoryAndDiagnosticData = ({ parentKey, form, initialData }: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);
  const [canAddHealthCondition, setCanAddHealthCondition] = useState(false);

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      setInitialValues(form, getName, initialData, HISTORY_AND_DIAG_FI_KEY);
      if (!initialData[HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS]) {
        setDefaultCondition();
      } else {
        const initialHealthConditions = initialData[HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS];
        const lastInitialHealthConditionsItem =
          initialHealthConditions[initialHealthConditions.length - 1];

        setCanAddHealthCondition(
          !!lastInitialHealthConditionsItem[HEALTH_CONDITION_ITEM_KEY.CONDITION] &&
            !!lastInitialHealthConditionsItem[HEALTH_CONDITION_ITEM_KEY.PARENTAL_LINK],
        );
      }
    } else {
      setDefaultCondition();
      setFieldValue(form, getName(HISTORY_AND_DIAG_FI_KEY.HAS_INBREEDING), undefined);
    }
    // eslint-disable-next-line
  }, []);

  const setDefaultCondition = () =>
    setFieldValue(form, getName(HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS), [
      {
        condition: '',
        parental_link: undefined,
      },
    ]);

  const resetListError = () => {
    resetFieldError(form, getName(HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS));

    const formFieldValueItems = getFieldValue(
      form,
      getName(HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS),
    );

    if (Array.isArray(formFieldValueItems) && formFieldValueItems.length > 0) {
      const lastItem = formFieldValueItems[formFieldValueItems.length - 1];
      setCanAddHealthCondition(
        !!lastItem[HEALTH_CONDITION_ITEM_KEY.CONDITION] &&
          !!lastItem[HEALTH_CONDITION_ITEM_KEY.PARENTAL_LINK],
      );
    } else {
      setCanAddHealthCondition(false);
    }
  };

  return (
    <div className={styles.historyAndDiagnosisHypSelect}>
      <Form.Item>
        <Form.Item
          label={intl.get('prescription.history.diagnosis.review.label.family.history')}
          name={getName(HISTORY_AND_DIAG_FI_KEY.REPORT_HEALTH_CONDITIONS)}
          valuePropName="checked"
          className="noMarginBtm"
        >
          <Checkbox>{intl.get('prescription.history.diagnosis.report.health.conditions')}</Checkbox>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prev, next) =>
            checkShouldUpdate(prev, next, [
              getName(HISTORY_AND_DIAG_FI_KEY.REPORT_HEALTH_CONDITIONS),
            ])
          }
        >
          {({ getFieldValue }) =>
            getFieldValue(getName(HISTORY_AND_DIAG_FI_KEY.REPORT_HEALTH_CONDITIONS)) ? (
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
                  name={getName(HISTORY_AND_DIAG_FI_KEY.HEALTH_CONDITIONS)}
                  rules={[
                    {
                      validator: async (_, conditions: IHealthConditionItem[]) => {
                        if (
                          !conditions.some(
                            (condition) =>
                              condition[HEALTH_CONDITION_ITEM_KEY.CONDITION] &&
                              condition[HEALTH_CONDITION_ITEM_KEY.PARENTAL_LINK],
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
                                name={[name, HEALTH_CONDITION_ITEM_KEY.CONDITION]}
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
                                name={[name, HEALTH_CONDITION_ITEM_KEY.PARENTAL_LINK]}
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
                                className={cx(!name ? styles.hidden : '', styles.removeIcon)}
                                onClick={() => {
                                  setCanAddHealthCondition(true);
                                  remove(name);
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
        name={getName(HISTORY_AND_DIAG_FI_KEY.HAS_INBREEDING)}
      >
        <Radio.Group>
          <Radio value={false}>{intl.get('no')}</Radio>
          <Radio value={true}>{intl.get('yes')}</Radio>
          <Radio value={undefined}>NA</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label={intl.get('prescription.history.diagnosis.review.label.ethnicity')}
        name={getName(HISTORY_AND_DIAG_FI_KEY.ETHNICITY)}
        wrapperCol={{ lg: 8, xl: 8, xxl: 6 }}
      >
        <Select placeholder={intl.get('prescription.add.parent.modal.select')}>
          {formConfig?.history_and_diagnosis.ethnicities.map((eth) => (
            <Select.Option key={eth.value} value={eth.value} title={null}>
              {eth.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label={intl.get('prescription.history.diagnosis.review.label.hypothesis')}
        name={getName(HISTORY_AND_DIAG_FI_KEY.DIAGNOSIS_HYPOTHESIS)}
        rules={defaultFormItemsRules}
        className="noMarginBtm"
      >
        <Input.TextArea rows={3} placeholder="Indications" data-cy="InputHypothesis" />
      </Form.Item>
    </div>
  );
};

export default HistoryAndDiagnosticData;
