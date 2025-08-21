import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { Checkbox, Form, Select, Typography } from 'antd';
import { HybridApi } from 'api/hybrid';
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);

  const [selectOption, setSelectOption] = useState<Array<{ label: string; value: string }>>([]);

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      setInitialValues(form, getName, initialData);
      if (initialData.project) {
        form.setFieldValue(getName('consent' satisfies keyof IProjectDataType), true);
      }
    }
  }, [form, getName, initialData]);

  useEffect(() => {
    HybridApi.getProjectList().then(({ data }) => {
      if (data && data.codes) {
        const formattedOptions = data.codes?.map((project: any) => ({
          label: project.description,
          value: project.code,
        }));
        setSelectOption(formattedOptions);
      }
    });
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
                options={selectOption}
              />
            </Form.Item>
          ) : null
        }
      </Form.Item>
    </>
  );
};

export default ResearchProjectData;
