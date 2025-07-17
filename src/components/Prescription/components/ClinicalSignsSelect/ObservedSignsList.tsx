import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Button, Checkbox, Form, FormInstance, Select, Space, Typography } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import cx from 'classnames';
import { capitalize } from 'lodash';

import PhenotypeSearch from 'components/PhenotypeSearch';
import { checkShouldUpdate, resetFieldError } from 'components/Prescription/utils/form';
import { IGetNamePathParams } from 'components/Prescription/utils/type';
import { usePrescriptionFormConfig } from 'store/prescription';

import { IClinicalSignItem, IClinicalSignsDataType } from './types';
import { getExistingHpoIdList, hpoValidationRule } from '.';

import styles from './index.module.css';

const { Text } = Typography;

interface OwnProps {
  form: FormInstance<any>;
  getName(...key: IGetNamePathParams): NamePath;
  isOptional?: boolean;
  initialSigns: IClinicalSignItem[];
}

const ObservedSignsList = ({ form, getName, isOptional, initialSigns }: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const [notObservedSigns, setNotObservedSigns] = useState<string[]>([]);
  const notObservedSignsField = Form.useWatch(
    getName('not_observed_signs' satisfies keyof IClinicalSignsDataType),
    form,
  );

  useEffect(() => {
    form.setFieldValue(
      getName('observed_signs' satisfies keyof IClinicalSignsDataType),
      initialSigns,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSigns]);

  const isDefaultHpo = (hpoValue: string) =>
    !!formConfig?.clinical_signs.default_list.find(({ value }) => value === hpoValue);

  const isAlreadyNotObserved = (hpoValue: string) => notObservedSigns.indexOf(hpoValue) > -1;

  const getNode = (index: number): IClinicalSignItem =>
    form.getFieldValue(getName('observed_signs' satisfies keyof IClinicalSignsDataType))[index];

  function updateNode(index: number, update: Partial<IClinicalSignItem>) {
    const nodes = [
      ...form.getFieldValue(getName('observed_signs' satisfies keyof IClinicalSignsDataType)),
    ];
    nodes[index] = { ...nodes[index], ...update };
    form.setFieldValue(getName('observed_signs' satisfies keyof IClinicalSignsDataType), nodes);

    // Re-set not observed sign to trigger re-rendering and validation
    const notObservedNodes = form.getFieldValue(
      getName('not_observed_signs' satisfies keyof IClinicalSignsDataType),
    );
    form.setFieldValue(
      getName('not_observed_signs' satisfies keyof IClinicalSignsDataType),
      notObservedNodes,
    );
  }

  useEffect(() => {
    const notObserved =
      (form.getFieldValue(
        getName('not_observed_signs' satisfies keyof IClinicalSignsDataType),
      ) as IClinicalSignItem[]) || [];
    setNotObservedSigns(notObserved.map((sign) => sign.code));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notObservedSignsField]);

  const [isRemoveClicked, setIsRemoveClicked] = useState(false);

  const resetSignsFieldErrors = () =>
    resetFieldError(form, getName('observed_signs' satisfies keyof IClinicalSignsDataType));

  return (
    <Space direction="vertical">
      <Space size={2}>
        <ProLabel
          requiredMark={!isOptional}
          title={
            isOptional
              ? intl.get('prescription.form.signs.observed.optional.label')
              : intl.get('prescription.form.signs.observed.label')
          }
        />
        {isOptional ? <Text type="secondary">({intl.get('optional')})</Text> : null}
        <ProLabel colon={true} title="" />
      </Space>
      <Form.Item className="noMarginBtm">
        <Form.List
          name={getName('observed_signs' satisfies keyof IClinicalSignsDataType)}
          rules={
            isOptional
              ? undefined
              : [
                  {
                    validator: async (_: any, signs: IClinicalSignItem[]) => {
                      if (!signs.some((sign) => sign.observed) && !isRemoveClicked) {
                        throw new Error(intl.get('prescription.form.signs.observed.error'));
                      }
                      setIsRemoveClicked(false);
                    },
                  },
                ]
          }
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <div className={cx(errors.length ? styles.listErrorWrapper : '')}>
                {fields.map(({ key, name, ...restField }) => {
                  const hpoNode = getNode(name);
                  const isDefaultHpoTerm = isDefaultHpo(hpoNode.code);
                  const checkBoxShouldBeDisabled = isAlreadyNotObserved(hpoNode.code);

                  const removeElement = () => {
                    setIsRemoveClicked(true);
                    remove(name);
                  };

                  return (
                    <div key={key} className={styles.hpoFormItem}>
                      <Space className={styles.hpoFormItemContent}>
                        {isDefaultHpoTerm ? (
                          <Form.Item
                            {...restField}
                            name={[name, 'observed' satisfies keyof IClinicalSignItem]}
                            valuePropName="checked"
                          >
                            <Checkbox
                              disabled={checkBoxShouldBeDisabled}
                              onClick={() => resetSignsFieldErrors()}
                              value={true}
                              data-cy={`Observed${hpoNode.code}`}
                            >
                              <Text>
                                {capitalize(hpoNode.name)}{' '}
                                <Text type="secondary">({hpoNode.code})</Text>
                              </Text>
                            </Checkbox>
                          </Form.Item>
                        ) : (
                          <Form.Item
                            {...restField}
                            className={styles['phenotype-search']}
                            name={[name, 'name' satisfies keyof IClinicalSignItem]}
                            rules={hpoValidationRule(hpoNode)}
                            validateTrigger="onSelect"
                          >
                            <PhenotypeSearch
                              defaultOption={{
                                id: hpoNode.code,
                                name: hpoNode.name,
                              }}
                              ignoreHpoIds={getExistingHpoIdList(form, getName)}
                              onClear={() => updateNode(name, { code: '', name: '' })}
                              onSelect={(hpo) => updateNode(name, { code: hpo.id, name: hpo.name })}
                            />
                          </Form.Item>
                        )}
                        <Form.Item
                          noStyle
                          shouldUpdate={(prev, next) =>
                            checkShouldUpdate(prev, next, [
                              getName(
                                'observed_signs' satisfies keyof IClinicalSignsDataType,
                                name,
                                'observed' satisfies keyof IClinicalSignItem,
                              ),
                            ])
                          }
                        >
                          {({ getFieldValue }) =>
                            getFieldValue(
                              getName(
                                'observed_signs' satisfies keyof IClinicalSignsDataType,
                                name,
                                'observed' satisfies keyof IClinicalSignItem,
                              ),
                            ) && (
                              <Form.Item
                                colon={false}
                                name={[name, 'age_code' satisfies keyof IClinicalSignItem]}
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
                                      title={null}
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
                            onClick={() => {
                              removeElement();
                            }}
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
                  onClick={async () => {
                    add({
                      name: '',
                      code: '',
                      observed: true,
                      age_code: 'unknown',
                    });
                  }}
                  icon={<PlusOutlined />}
                >
                  {intl.get('prescription.form.signs.observed.add')}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
    </Space>
  );
};

export default ObservedSignsList;