import React, { useState } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Button, Checkbox, Form, FormInstance, Select, Space, Typography } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import cx from 'classnames';
import { capitalize } from 'lodash';

import PhenotypeModal from 'components/PhenotypeTree/TransferModal';
import { defaultFormItemsRules } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { checkShouldUpdate } from 'components/Prescription/utils/form';
import { IGetNamePathParams } from 'components/Prescription/utils/type';
import { usePrescriptionFormConfig } from 'store/prescription';
import { extractPhenotypeTitleAndCode } from 'utils/hpo';

import { CLINICAL_SIGNS_FI_KEY, CLINICAL_SIGNS_ITEM_KEY, IClinicalSignItem } from './types';

import styles from './index.module.scss';

const { Text } = Typography;

interface OwnProps {
  form: FormInstance<any>;
  getName(...key: IGetNamePathParams): NamePath;
}

const ObservedSignsList = ({ form, getName }: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const [isPhenotypeModalVisible, setIsPhenotypeModalVisible] = useState(false);

  const isDefaultHpo = (hpoValue: string) =>
    !!formConfig?.clinical_signs.default_list.find(({ value }) => value === hpoValue);

  const getNode = (index: number): IClinicalSignItem =>
    form.getFieldValue(getName(CLINICAL_SIGNS_FI_KEY.SIGNS))[index];

  return (
    <Space direction="vertical">
      <ProLabel requiredMark title="Sélectionner au moins un signe clinique OBSERVÉ" colon />
      <Form.Item wrapperCol={{ xxl: 14 }} className="noMarginBtm">
        <Form.List
          name={getName(CLINICAL_SIGNS_FI_KEY.SIGNS)}
          rules={[
            {
              validator: async (_, signs: IClinicalSignItem[]) => {
                if (!signs.some((sign) => sign[CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED] === true)) {
                  return Promise.reject(new Error('Sélectionner au moins un (1) signe clinique'));
                }
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

                  return (
                    <div
                      key={key}
                      className={cx(
                        styles.hpoFormItem,
                        !isDefaultHpoTerm && styles.customHpoFormItem,
                      )}
                    >
                      <Space className={styles.hpoFormItemContent}>
                        <Form.Item
                          {...restField}
                          name={[name, CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED]}
                          valuePropName="checked"
                        >
                          <Checkbox value={true}>
                            <Text>
                              {capitalize(hpoNode[CLINICAL_SIGNS_ITEM_KEY.NAME])}{' '}
                              <Text type="secondary">
                                ({hpoNode[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]})
                              </Text>
                            </Text>
                          </Checkbox>
                        </Form.Item>
                        {!isDefaultHpoTerm && (
                          <CloseOutlined
                            className={styles.removeIcon}
                            onClick={() => remove(name)}
                          />
                        )}
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
                            ) === true ? (
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
                            ) : null
                          }
                        </Form.Item>
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
                  Ajouter un autre signe clinique observé
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
                    .filter(({ key }) => !valuesList.includes(key))
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
