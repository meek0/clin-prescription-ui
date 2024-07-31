import { useEffect, useState } from 'react';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Form, Input, Space } from 'antd';
import { clone, isEmpty } from 'lodash';

import { getNamePath, setFieldValue, setInitialValues } from 'components/Prescription/utils/form';
import { IAnalysisFormPart, IGetNamePathParams } from 'components/Prescription/utils/type';
import { usePrescriptionFormConfig } from 'store/prescription';

import NotObservedSignsList from './NotObservedSignsList';
import ObservedSignsList from './ObservedSignsList';
import { CLINICAL_SIGNS_FI_KEY, CLINICAL_SIGNS_ITEM_KEY, IClinicalSignsDataType } from './types';

import styles from './index.module.css';

type OwnProps = IAnalysisFormPart & {
  initialData?: IClinicalSignsDataType;
};

const ClinicalSignsSelect = ({ form, parentKey, initialData }: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const [hpoList, setHpoList] = useState(clone(formConfig?.clinical_signs.default_list) ?? []);

  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);

  const setDefaultList = () =>
    setFieldValue(
      form,
      getName(CLINICAL_SIGNS_FI_KEY.SIGNS),
      hpoList.map((term) => ({
        [CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]: term.value,
        [CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED]: false,
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
      <Space direction="vertical" style={{ width: '100%' }}>
        <ObservedSignsList form={form} getName={getName} />
        <NotObservedSignsList form={form} getName={getName} />
        <ProLabel title="Commentaire clinique général" colon />
        <Form.Item name={getName(CLINICAL_SIGNS_FI_KEY.CLINIC_REMARK)} className="noMarginBtm">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Space>
    </div>
  );
};

export default ClinicalSignsSelect;
