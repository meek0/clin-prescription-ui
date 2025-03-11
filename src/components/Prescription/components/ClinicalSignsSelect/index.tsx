import { useEffect } from 'react';
import intl from 'react-intl-universal';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Form, Input, Space } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { HpoApi } from 'api/hpo';

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
  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);

  const defaultHpo =
    formConfig?.clinical_signs.default_list.map((term) => ({
      [CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]: term.value,
      [CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED]: false,
      [CLINICAL_SIGNS_ITEM_KEY.NAME]: term.name,
      [CLINICAL_SIGNS_ITEM_KEY.AGE_CODE]: 'unknown',
    })) || [];

  useEffect(() => {
    if (
      initialData &&
      (initialData[CLINICAL_SIGNS_FI_KEY.SIGNS] ||
        initialData[CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS])
    ) {
      const defaultObservedHposWithValue: IClinicalSignItem[] = [...defaultHpo];
      const customHpos: IClinicalSignItem[] = [];

      initialData[CLINICAL_SIGNS_FI_KEY.SIGNS].forEach((hpo) => {
        const defaultHpo = defaultObservedHposWithValue.find(({ value }) => value === hpo.value);
        if (defaultHpo) {
          defaultHpo[CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED] =
            hpo[CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED];
          defaultHpo[CLINICAL_SIGNS_ITEM_KEY.AGE_CODE] = hpo[CLINICAL_SIGNS_ITEM_KEY.AGE_CODE];
        } else if (hpo[CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED]) {
          customHpos.push(hpo);
        }
      });

      getHPOWithLabels([
        ...customHpos,
        ...(initialData[CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS] || []).map((hpo) => ({
          ...hpo,
          is_observed: false,
        })),
      ]).then((hpos) => {
        const observedSigns: IClinicalSignItem[] = [];
        const nonObservedSigns: IClinicalSignItem[] = [];
        hpos.forEach((hpo) => (hpo.is_observed ? observedSigns : nonObservedSigns).push(hpo));

        setInitialValues(
          form,
          getName,
          {
            ...initialData,
            [CLINICAL_SIGNS_FI_KEY.SIGNS]: [...defaultObservedHposWithValue, ...observedSigns],
            [CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS]: nonObservedSigns,
          },
          CLINICAL_SIGNS_FI_KEY,
        );
      });
    } else {
      // Set default list
      setFieldValue(form, getName(CLINICAL_SIGNS_FI_KEY.SIGNS), defaultHpo);
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

async function getHPOWithLabels(data: IClinicalSignItem[]) {
  return await Promise.all(
    data.map(async (value) => {
      const { data } = await HpoApi.searchHpos(value[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]);
      const hpo = data?.hits[0];
      return {
        [CLINICAL_SIGNS_ITEM_KEY.NAME]: hpo?._source.name ?? 'cannot find HPO',
        [CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]:
          hpo?._source.hpo_id ?? value[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE],
        [CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED]: value[CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED],
        [CLINICAL_SIGNS_ITEM_KEY.AGE_CODE]: value[CLINICAL_SIGNS_ITEM_KEY.AGE_CODE],
      } as IClinicalSignItem;
    }),
  );
}
