import { useEffect, useState } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Radio, Select, Space, Typography } from 'antd';
import cx from 'classnames';
import { capitalize, clone, isEmpty } from 'lodash';

import PhenotypeModal from 'components/PhenotypeTree/TransferModal';
import { defaultFormItemsRules } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import {
  checkShouldUpdate,
  getNamePath,
  resetFieldError,
  setFieldValue,
  setInitialValues,
} from 'components/Prescription/utils/form';
import { IAnalysisFormPart, IGetNamePathParams } from 'components/Prescription/utils/type';
import { usePrescriptionFormConfig } from 'store/prescription';
import { extractPhenotypeTitleAndCode } from 'utils/hpo';

import styles from './index.module.scss';

const { Text } = Typography;

type OwnProps = IAnalysisFormPart & {
  initialData?: IClinicalSignsDataType;
};

export const CLINICAL_SIGN_NA = 'NA';

export enum CLINICAL_SIGNS_FI_KEY {
  SIGNS = 'signs',
  CLINIC_REMARK = 'comment',
}

export enum CLINICAL_SIGNS_ITEM_KEY {
  IS_OBSERVED = 'is_observed',
  AGE_CODE = 'age_code',
  TERM_VALUE = 'value',
  NAME = 'name',
}

export interface IClinicalSignItem {
  [CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]: string;
  [CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED]: boolean | string;
  [CLINICAL_SIGNS_ITEM_KEY.AGE_CODE]?: string;
  [CLINICAL_SIGNS_ITEM_KEY.NAME]: string;
}

export interface IClinicalSignsDataType {
  [CLINICAL_SIGNS_FI_KEY.SIGNS]: IClinicalSignItem[];
  [CLINICAL_SIGNS_FI_KEY.CLINIC_REMARK]?: string;
}

const ClinicalSignsSelect = ({ form, parentKey, initialData }: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const [hpoList, setHpoList] = useState(clone(formConfig?.clinical_signs.default_list) ?? []);
  const [isPhenotypeModalVisible, setIsPhenotypeModalVisible] = useState(false);

  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);

  const isDefaultHpo = (hpoValue: string) =>
    !!formConfig?.clinical_signs.default_list.find(({ value }) => value === hpoValue);

  const getNode = (index: number): IClinicalSignItem =>
    form.getFieldValue(getName(CLINICAL_SIGNS_FI_KEY.SIGNS))[index];

  const setDefaultList = () =>
    setFieldValue(
      form,
      getName(CLINICAL_SIGNS_FI_KEY.SIGNS),
      hpoList.map((term) => ({
        [CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]: term.value,
        [CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED]: CLINICAL_SIGN_NA,
        [CLINICAL_SIGNS_ITEM_KEY.NAME]: term.name,
      })),
    );

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      const initialSigns = initialData[CLINICAL_SIGNS_FI_KEY.SIGNS];
      if (initialSigns) {
        setHpoList(
          initialSigns.map((value) => ({
            name: value[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE],
            value: value[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE],
          })),
        );
      } else {
        setDefaultList();
      }

      setInitialValues(form, getName, initialData, CLINICAL_SIGNS_FI_KEY);
    } else {
      setDefaultList();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.clinicalSignsSelect}>
      <Form.Item>
        <Text className={styles.clinicalSignNotice}>
          Sélectionner <Text type="danger">au moins un (1)</Text> signe clinique{' '}
          <Text type="danger">observé</Text>. Sélectionner les signes{' '}
          <Text type="success">non observés</Text> que vous jugez{' '}
          <Text type="success">pertinents</Text>.
        </Text>
      </Form.Item>
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
                      <Space direction="vertical" className={styles.hpoFormItemContent}>
                        <div className={styles.hpoFormItemTopWrapper}>
                          <Form.Item
                            {...restField}
                            name={[name, CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED]}
                            label={
                              <Text>
                                {capitalize(hpoNode[CLINICAL_SIGNS_ITEM_KEY.NAME])}{' '}
                                <Text type="secondary">
                                  ({hpoNode[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]})
                                </Text>
                              </Text>
                            }
                          >
                            <Radio.Group
                              onChange={(e) => {
                                if (e.target.value) {
                                  resetFieldError(form, getName(CLINICAL_SIGNS_FI_KEY.SIGNS));
                                }
                              }}
                            >
                              <Radio
                                value={true}
                                data-cy={`Observed${hpoNode[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]}`}
                              >
                                Observé
                              </Radio>
                              <Radio value={false}>Non observé</Radio>
                              {isDefaultHpoTerm && <Radio value={CLINICAL_SIGN_NA}>NA</Radio>}
                            </Radio.Group>
                          </Form.Item>
                          {!isDefaultHpoTerm && (
                            <CloseOutlined
                              className={styles.removeIcon}
                              onClick={() => remove(name)}
                            />
                          )}
                        </div>
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
                                label={<></>}
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
              <Form.Item colon={false} label={<></>}>
                <Button
                  type="link"
                  className={styles.addClinicalSignBtn}
                  onClick={() => setIsPhenotypeModalVisible(true)}
                  icon={<PlusOutlined />}
                >
                  Ajouter un signe clinique
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
      <Form.Item
        label="Commentaire clinique général"
        name={getName(CLINICAL_SIGNS_FI_KEY.CLINIC_REMARK)}
        className="noMarginBtm"
      >
        <Input.TextArea rows={3} />
      </Form.Item>
    </div>
  );
};

export default ClinicalSignsSelect;
