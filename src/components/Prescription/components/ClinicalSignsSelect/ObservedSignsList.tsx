import React, { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Button, Checkbox, Form, FormInstance, Select, Space, Typography } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import cx from 'classnames';
import { capitalize } from 'lodash';

import PhenotypeModal from 'components/PhenotypeTree/TransferModal';
import { defaultFormItemsRules } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { checkShouldUpdate, resetFieldError } from 'components/Prescription/utils/form';
import { IGetNamePathParams } from 'components/Prescription/utils/type';
import { usePrescriptionFormConfig } from 'store/prescription';
import { extractPhenotypeTitleAndCode } from 'utils/hpo';

import { CLINICAL_SIGNS_FI_KEY, CLINICAL_SIGNS_ITEM_KEY, IClinicalSignItem } from './types';

import styles from './index.module.css';

const { Text } = Typography;

interface OwnProps {
  form: FormInstance<any>;
  getName(...key: IGetNamePathParams): NamePath;
}

const ObservedSignsList = ({ form, getName }: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const [isPhenotypeModalVisible, setIsPhenotypeModalVisible] = useState(false);
  const [notObservedSigns, setNotObservedSigns] = useState<string[]>([]);
  const notObservedSignsField = Form.useWatch(
    getName(CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS),
    form,
  );

  const isDefaultHpo = (hpoValue: string) =>
    !!formConfig?.clinical_signs.default_list.find(({ value }) => value === hpoValue);

  const isAlreadyNotObserved = (hpoValue: string) => notObservedSigns.indexOf(hpoValue) > -1;

  const getNode = (index: number): IClinicalSignItem =>
    form.getFieldValue(getName(CLINICAL_SIGNS_FI_KEY.SIGNS))[index];

  useEffect(() => {
    const notObserved =
      (form.getFieldValue(
        getName(CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS),
      ) as IClinicalSignItem[]) || [];
    setNotObservedSigns(notObserved.map((sign) => sign[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]));
  }, [notObservedSignsField]);

  const [isRemoveClicked, setIsRemoveClicked] = useState(false);

  const resetSignsFieldErrors = () => resetFieldError(form, getName(CLINICAL_SIGNS_FI_KEY.SIGNS));

  return (
    <Space direction="vertical">
      <ProLabel requiredMark title={intl.get('prescription.form.signs.observed.label')} colon />
      <Form.Item className="noMarginBtm">
        <Form.List
          name={getName(CLINICAL_SIGNS_FI_KEY.SIGNS)}
          rules={[
            {
              validator: async (_, signs: IClinicalSignItem[]) => {
                if (
                  !signs.some((sign) => sign[CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED] === true) &&
                  !isRemoveClicked
                ) {
                  return Promise.reject(
                    new Error(intl.get('prescription.form.signs.observed.error')),
                  );
                }

                setIsRemoveClicked(false);
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <div className={cx(errors.length ? styles.listErrorWrapper : '')}>
                {fields.map(({ key, name, ...restField }) => {
                  const hpoNode = getNode(name);
                  const isDefaultHpoTerm = isDefaultHpo(
                    hpoNode[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE],
                  );
                  const checkBoxShouldBeDisabled = isAlreadyNotObserved(
                    hpoNode[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE],
                  );

                  const removeElement = () => {
                    setIsRemoveClicked(true);
                    remove(name);
                  };

                  return (
                    <div key={key} className={styles.hpoFormItem}>
                      <Space className={styles.hpoFormItemContent}>
                        <Form.Item
                          {...restField}
                          name={[name, CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED]}
                          valuePropName="checked"
                        >
                          <Checkbox
                            disabled={checkBoxShouldBeDisabled}
                            onClick={() => resetSignsFieldErrors()}
                            value={true}
                            data-cy={`Observed${hpoNode[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]}`}
                          >
                            <Text>
                              {capitalize(hpoNode[CLINICAL_SIGNS_ITEM_KEY.NAME])}{' '}
                              <Text type="secondary">
                                ({hpoNode[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]})
                              </Text>
                            </Text>
                          </Checkbox>
                        </Form.Item>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prev, next) =>
                            checkShouldUpdate(prev, next, [
                              getName(
                                CLINICAL_SIGNS_FI_KEY.SIGNS,
                                name,
                                CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED,
                              ),
                            ])
                          }
                        >
                          {({ getFieldValue }) =>
                            getFieldValue(
                              getName(
                                CLINICAL_SIGNS_FI_KEY.SIGNS,
                                name,
                                CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED,
                              ),
                            ) && (
                              <Form.Item
                                colon={false}
                                name={[name, CLINICAL_SIGNS_ITEM_KEY.AGE_CODE]}
                                rules={defaultFormItemsRules}
                                required={false}
                              >
                                <Select
                                  dropdownMatchSelectWidth={false}
                                  placeholder="Âge d'apparition"
                                  className={styles.ageSelectInput}
                                  data-cy="SelectAge"
                                >
                                  {formConfig?.clinical_signs.onset_age.map((age) => (
                                    <Select.Option
                                      key={age.value}
                                      value={age.value}
                                      data-cy={`SelectOption${age.value}`}
                                    >
                                      {age.name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            )
                          }
                        </Form.Item>
                        {!isDefaultHpoTerm && (
                          <CloseOutlined
                            className={styles.removeIcon}
                            onClick={() => removeElement()}
                          />
                        )}
                      </Space>
                    </div>
                  );
                })}
              </div>
              <Form.Item noStyle>
                <Form.ErrorList errors={errors} />
              </Form.Item>
              <Form.Item colon={false}>
                <Button
                  type="link"
                  className={styles.addClinicalSignBtn}
                  onClick={() => setIsPhenotypeModalVisible(true)}
                  icon={<PlusOutlined />}
                >
                  {intl.get('prescription.form.signs.observed.add')}
                </Button>
              </Form.Item>
              <PhenotypeModal
                visible={isPhenotypeModalVisible}
                onVisibleChange={setIsPhenotypeModalVisible}
                onApply={(nodes) => {
                  const currentValues = form.getFieldValue(
                    getName(CLINICAL_SIGNS_FI_KEY.SIGNS),
                  ) as IClinicalSignItem[];
                  const valuesList = currentValues.map(({ value }) => value);

                  nodes
                    .filter(
                      ({ key }) => !valuesList.includes(key) && !notObservedSigns.includes(key),
                    )
                    .forEach((node) =>
                      add({
                        [CLINICAL_SIGNS_ITEM_KEY.NAME]: extractPhenotypeTitleAndCode(node.title)
                          ?.title,
                        [CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]: node.key,
                        [CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED]: true,
                      }),
                    );
                }}
              />
            </>
          )}
        </Form.List>
      </Form.Item>
    </Space>
  );
};

export default ObservedSignsList;
