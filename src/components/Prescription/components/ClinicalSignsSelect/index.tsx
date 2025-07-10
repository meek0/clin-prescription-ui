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
import { IClinicalSignItem, IClinicalSignsDataType } from './types';

import styles from './index.module.css';

type OwnProps = IAnalysisFormPart & {
  hpoIsOptional?: boolean;
  initialData?: IClinicalSignsDataType;
};

const ClinicalSignsSelect = ({ form, parentKey, hpoIsOptional, initialData }: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);

  const defaultObservedSigns =
    !hpoIsOptional && formConfig
      ? formConfig.clinical_signs.default_list.map((term) => ({
          code: term.value,
          observed: false,
          name: term.name,
          age_code: 'unknown',
        }))
      : [];

  useEffect(() => {
    if (initialData?.observed_signs || initialData?.not_observed_signs) {
      const nonDefaultObservedSigns: IClinicalSignItem[] = [];

      initialData.observed_signs?.forEach((sign) => {
        const defaultSign = defaultObservedSigns.find(({ code }) => code === sign.code);
        if (defaultSign) {
          defaultSign.observed = sign.observed;
          defaultSign.age_code = sign.age_code!;
        } else if (sign.observed) {
          nonDefaultObservedSigns.push(sign);
        }
      });

      getSignsNames([...nonDefaultObservedSigns, ...(initialData?.not_observed_signs || [])]).then(
        (signs) => {
          const observed_signs: IClinicalSignItem[] = [...defaultObservedSigns];
          const not_observed_signs: IClinicalSignItem[] = [];
          signs.forEach((sign) => (sign.observed ? observed_signs : not_observed_signs).push(sign));

          setInitialValues(form, getName, {
            comment: initialData.comment,
            observed_signs,
            not_observed_signs,
          } as IClinicalSignsDataType);
        },
      );
    } else {
      // Set default list
      setFieldValue(
        form,
        getName('observed_signs' satisfies keyof IClinicalSignsDataType),
        defaultObservedSigns,
      );
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.clinicalSignsSelect}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <ObservedSignsList form={form} getName={getName} isOptional={hpoIsOptional} />
        <NotObservedSignsList form={form} getName={getName} />
        <ProLabel title="Commentaire clinique général" colon />
        <Form.Item
          name={getName('comment' satisfies keyof IClinicalSignsDataType)}
          className="noMarginBtm"
        >
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
    form.getFieldValue(
      getName('observed_signs' satisfies keyof IClinicalSignsDataType) as IClinicalSignItem[],
    ) || [];
  const nonObservedSignFields =
    form.getFieldValue(
      getName('not_observed_signs' satisfies keyof IClinicalSignsDataType) as IClinicalSignItem[],
    ) || [];
  return observedSignFields
    .concat(nonObservedSignFields)
    .map((field: IClinicalSignItem) => field.code);
}

// Check if HPO item is valid (name is defined)
export function hpoValidationRule(hpoNode: IClinicalSignItem) {
  return [
    {
      validator: async () => {
        if (!hpoNode.name) {
          return Promise.reject(
            new Error(intl.get('prescription.form.signs.observed.invalid.hpo')),
          );
        }
      },
    },
  ];
}

async function getSignsNames(signs: IClinicalSignItem[]) {
  return await Promise.all(
    signs.map(async (sign) => {
      const { data } = await HpoApi.searchHpos(sign.code);
      const hpo = data?.hits[0];
      return {
        ...sign,
        name: hpo?._source.name ?? 'cannot find HPO',
        code: hpo?._source.hpo_id ?? sign.code,
      } as IClinicalSignItem;
    }),
  );
}
