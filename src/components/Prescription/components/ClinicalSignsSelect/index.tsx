import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Form, Input, Space } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { clone, isEmpty } from 'lodash';

import { getNamePath, setFieldValue, setInitialValues } from 'components/Prescription/utils/form';
import { IAnalysisFormPart, IGetNamePathParams } from 'components/Prescription/utils/type';
import { usePrescriptionFormConfig } from 'store/prescription';

import NotObservedSignsList from './NotObservedSignsList';
import ObservedSignsList from './ObservedSignsList';
import {
  CLINICAL_SIGNS_FI_KEY,
  CLINICAL_SIGNS_ITEM_KEY,
  IClinicalSignItem,
  IClinicalSignsDataType,
} from './types';

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
      if (initialData[CLINICAL_SIGNS_FI_KEY.SIGNS]) {
        setHpoList(
          initialData[CLINICAL_SIGNS_FI_KEY.SIGNS].map((value) => ({
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

export function getExistingHpoIdList(
  form: FormInstance<any>,
  getName: (...key: IGetNamePathParams) => any,
) {
  const observedSignFields =
    form.getFieldValue(getName(CLINICAL_SIGNS_FI_KEY.SIGNS) as IClinicalSignItem[]) || [];
  const nonObservedSignFields =
    form.getFieldValue(getName(CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS) as IClinicalSignItem[]) ||
    [];
  return observedSignFields
    .concat(nonObservedSignFields)
    .map((field: IClinicalSignItem) => field.value);
}

// Check if HPO item is valid (name is defined)
export function hpoValidationRule(hpoNode: IClinicalSignItem) {
  return [
    {
      validator: async () => {
        if (!hpoNode[CLINICAL_SIGNS_ITEM_KEY.NAME]) {
          return Promise.reject(
            new Error(intl.get('prescription.form.signs.observed.invalid.hpo')),
          );
        }
      },
    },
  ];
}
