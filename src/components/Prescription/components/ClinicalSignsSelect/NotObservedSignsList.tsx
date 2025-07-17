import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Button, Form, FormInstance, Space, Typography } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import cx from 'classnames';

import PhenotypeSearch from 'components/PhenotypeSearch';
import { IGetNamePathParams } from 'components/Prescription/utils/type';

import { IClinicalSignItem, IClinicalSignsDataType } from './types';
import { getExistingHpoIdList, hpoValidationRule } from '.';

import styles from './index.module.css';

const { Text } = Typography;

interface OwnProps {
  form: FormInstance<any>;
  getName(...key: IGetNamePathParams): NamePath;
  initialSigns: IClinicalSignItem[];
}

const NotObservedSignsList = ({ form, getName, initialSigns }: OwnProps) => {
  const [isAddingRemovingNotObservedSign, setIsAddingRemovingNotObservedSign] = useState(false);
  useEffect(() => {
    if (isAddingRemovingNotObservedSign) {
      setIsAddingRemovingNotObservedSign(false);
      return;
    }
    form.setFieldValue(
      getName('not_observed_signs' satisfies keyof IClinicalSignsDataType),
      initialSigns,
    );
  }, [form, getName, initialSigns]);

  const getNode = (index: number): IClinicalSignItem =>
    form.getFieldValue(getName('not_observed_signs' satisfies keyof IClinicalSignsDataType))[index];

  function updateNode(index: number, update: Partial<IClinicalSignItem>) {
    const nodes = [
      ...form.getFieldValue(getName('not_observed_signs' satisfies keyof IClinicalSignsDataType)),
    ];
    nodes[index] = { ...nodes[index], ...update };
    form.setFieldValue(getName('not_observed_signs' satisfies keyof IClinicalSignsDataType), nodes);

    // Re-set observed sign to trigger re-rendering and validation
    const notObservedNodes = form.getFieldValue(
      getName('observed_signs' satisfies keyof IClinicalSignsDataType),
    );
    form.setFieldValue(
      getName('observed_signs' satisfies keyof IClinicalSignsDataType),
      notObservedNodes,
    );
  }

  return (
    <Space direction="vertical">
      <Space size={2}>
        <ProLabel title={intl.get('prescription.form.signs.not.observed.label')} />
        <Text type="secondary">({intl.get('optional')})</Text>
        <ProLabel title={' :'} />
      </Space>
      <Form.Item wrapperCol={{ xxl: 14 }} className="noMarginBtm">
        <Form.List name={getName('not_observed_signs' satisfies keyof IClinicalSignsDataType)}>
          {(fields, { add, remove }, { errors }) => (
            <>
              <div className={cx(errors.length ? styles.listErrorWrapper : '')}>
                {fields.map(({ key, name, ...restField }) => {
                  const hpoNode = getNode(name);

                  return (
                    <div key={key} className={styles.hpoFormItem}>
                      <Space size={8} className={styles.hpoFormItemContent}>
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
                            onSelect={(hpo) => {
                              updateNode(name, { code: hpo.id, name: hpo.name });
                            }}
                          />
                        </Form.Item>
                        <CloseOutlined
                          className={styles.removeIcon}
                          onClick={() => {
                            setIsAddingRemovingNotObservedSign(true);
                            remove(name);
                          }}
                        />
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
                  onClick={() => {
                    setIsAddingRemovingNotObservedSign(true);
                    add({
                      name: '',
                      code: '',
                      observed: false,
                    });
                  }}
                  icon={<PlusOutlined />}
                >
                  {intl.get('prescription.form.signs.not.observed.add')}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
    </Space>
  );
};

export default NotObservedSignsList;
