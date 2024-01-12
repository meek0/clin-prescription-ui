import { useState } from 'react';
import intl from 'react-intl-universal';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Button, Form, FormInstance, Space, Typography } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import cx from 'classnames';
import { capitalize } from 'lodash';

import PhenotypeModal from 'components/PhenotypeTree/TransferModal';
import { IGetNamePathParams } from 'components/Prescription/utils/type';
import { extractPhenotypeTitleAndCode } from 'utils/hpo';

import { CLINICAL_SIGNS_FI_KEY, CLINICAL_SIGNS_ITEM_KEY, IClinicalSignItem } from './types';

import styles from './index.module.scss';

const { Text } = Typography;

interface OwnProps {
  form: FormInstance<any>;
  getName(...key: IGetNamePathParams): NamePath;
}

const NotObservedSignsList = ({ form, getName }: OwnProps) => {
  const [isPhenotypeModalVisible, setIsPhenotypeModalVisible] = useState(false);

  const getNode = (index: number): IClinicalSignItem =>
    form.getFieldValue(getName(CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS))[index];

  return (
    <Space direction="vertical">
      <Space size={2}>
        <ProLabel title={intl.get('prescription.form.signs.not.observed.label')} />
        <Text type="secondary">({intl.get('optional')}) :</Text>
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
                          name={[name, CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED]}
                          valuePropName="checked"
                          style={{ marginLeft: 10 }}
                        >
                          <Text>
                            <Space size={4} className={styles.notObservedHpotext}>
                              {capitalize(hpoNode[CLINICAL_SIGNS_ITEM_KEY.NAME])}
                              <Text type="secondary">
                                ({hpoNode[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]})
                              </Text>
                            </Space>
                          </Text>
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
                  onClick={() => setIsPhenotypeModalVisible(true)}
                  icon={<PlusOutlined />}
                >
                  {intl.get('prescription.form.signs.not.observed.add')}
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

export default NotObservedSignsList;
