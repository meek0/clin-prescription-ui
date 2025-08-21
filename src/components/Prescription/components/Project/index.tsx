import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Checkbox, Form, Select, Typography } from 'antd';
import { isEmpty } from 'lodash';

import { defaultFormItemsRules } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { getNamePath, setInitialValues } from 'components/Prescription/utils/form';
import { IAnalysisFormPart, IGetNamePathParams } from 'components/Prescription/utils/type';

import { IProjectDataType } from './types';

import styles from './index.module.css';
const { Text } = Typography;

type OwnProps = IAnalysisFormPart & {
  initialData?: IProjectDataType;
};

const ResearchProjectData = ({ parentKey, form, initialData }: OwnProps) => {
  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);

  const getResearchProjectOptions = () => [
    {
      label: 'Care4Rare-Expand',
      value: 'Care4Rare-Expand',
    },
  ];
  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      setInitialValues(form, getName, initialData);
      if (initialData.project) {
        form.setFieldValue(getName('consent' satisfies keyof IProjectDataType), true);
      }
    }
  }, []);

  return (
    <>
      <Form.Item>
        <Text>{intl.get('prescription.project.info')}</Text>
      </Form.Item>
      <Form.Item name={getName('consent' satisfies keyof IProjectDataType)} valuePropName="checked">
        <Checkbox>{intl.get('prescription.project.consent')}</Checkbox>
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue(getName('consent' satisfies keyof IProjectDataType)) ? (
            <Form.Item
              name={getName('project' satisfies keyof IProjectDataType)}
              label={intl.get('prescription.project.select.label')}
              rules={defaultFormItemsRules}
              className={styles.projectSelect}
            >
              <Select
                placeholder={intl.get('prescription.add.parent.modal.select')}
                options={getResearchProjectOptions()}
              />
            </Form.Item>
          ) : null
        }
      </Form.Item>
    </>
  );
};

export default ResearchProjectData;
