import intl from 'react-intl-universal';
import { CloseOutlined } from '@ant-design/icons';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Form, FormInstance, Space, Typography } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import cx from 'classnames';
import { capitalize } from 'lodash';

import PhenotypeSearch from 'components/PhenotypeSearch';
import { IGetNamePathParams } from 'components/Prescription/utils/type';

import { CLINICAL_SIGNS_FI_KEY, CLINICAL_SIGNS_ITEM_KEY, IClinicalSignItem } from './types';
import { getExistingHpoIdList } from '.';

import styles from './index.module.css';

const { Text } = Typography;

interface OwnProps {
  form: FormInstance<any>;
  getName(...key: IGetNamePathParams): NamePath;
}

const NotObservedSignsList = ({ form, getName }: OwnProps) => {
  const getNode = (index: number): IClinicalSignItem =>
    form.getFieldValue(getName(CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS))[index];

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
              <Form.Item colon={false} className={styles.addClinicalSign}>
                <PhenotypeSearch
                  ignoreHpoIds={getExistingHpoIdList(form, getName)}
                  onSelect={(hpos) => {
                    for (const hpo of hpos) {
                      add({
                        [CLINICAL_SIGNS_ITEM_KEY.NAME]: hpo.name,
                        [CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]: hpo.id,
                        [CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED]: true,
                      });
                    }
                  }}
                />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
    </Space>
  );
};

export default NotObservedSignsList;
