import intl from 'react-intl-universal';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Button, Form, FormInstance, Space, Typography } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import cx from 'classnames';

import PhenotypeSearch from 'components/PhenotypeSearch';
import { IGetNamePathParams } from 'components/Prescription/utils/type';

import { CLINICAL_SIGNS_FI_KEY, CLINICAL_SIGNS_ITEM_KEY, IClinicalSignItem } from './types';
import { getExistingHpoIdList, hpoValidationRule } from '.';

import styles from './index.module.css';

const { Text } = Typography;

interface OwnProps {
  form: FormInstance<any>;
  getName(...key: IGetNamePathParams): NamePath;
}

const NotObservedSignsList = ({ form, getName }: OwnProps) => {
  const getNode = (index: number): IClinicalSignItem =>
    form.getFieldValue(getName(CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS))[index];

  function updateNode(index: number, update: Partial<IClinicalSignItem>) {
    const nodes = [...form.getFieldValue(getName(CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS))];
    nodes[index] = { ...nodes[index], ...update };
    form.setFieldValue(getName(CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS), nodes);

    // Re-set observed sign to trigger re-rendering and validation
    const notObservedNodes = form.getFieldValue(getName(CLINICAL_SIGNS_FI_KEY.SIGNS));
    form.setFieldValue(getName(CLINICAL_SIGNS_FI_KEY.SIGNS), notObservedNodes);
  }

  return (
    <Space direction="vertical">
      <Space size={2}>
        <ProLabel title={intl.get('prescription.form.signs.not.observed.label')} />
        <Text type="secondary">({intl.get('optional')})</Text>
        <ProLabel title={' :'} />
      </Space>
      <Form.Item wrapperCol={{ xxl: 14 }} className="noMarginBtm">
        <Form.List name={getName(CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS)}>
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
                          name={[name, CLINICAL_SIGNS_ITEM_KEY.NAME]}
                          rules={hpoValidationRule(hpoNode)}
                          validateTrigger="onSelect"
                        >
                          <PhenotypeSearch
                            defaultOption={{
                              id: hpoNode[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE],
                              name: hpoNode[CLINICAL_SIGNS_ITEM_KEY.NAME],
                            }}
                            ignoreHpoIds={getExistingHpoIdList(
                              form,
                              getName,
                              CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS,
                            )}
                            onClear={() => updateNode(name, { value: '', name: '' })}
                            onSelect={(hpo) => {
                              updateNode(name, { value: hpo.id, name: hpo.name });
                            }}
                          />
                        </Form.Item>
                        <CloseOutlined className={styles.removeIcon} onClick={() => remove(name)} />
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
                  onClick={() =>
                    add({
                      [CLINICAL_SIGNS_ITEM_KEY.NAME]: '',
                      [CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]: '',
                      [CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED]: true,
                    })
                  }
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
