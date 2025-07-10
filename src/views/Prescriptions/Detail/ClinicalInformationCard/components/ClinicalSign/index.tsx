import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { Descriptions, Space } from 'antd';
import { TFormConfig } from 'api/form/models';
import { HpoApi } from 'api/hpo';
import { IHpoNode } from 'api/hpo/models';
import { HybridPatientClinical, HybridPatientSign } from 'api/hybrid/models';
import { map } from 'lodash';

import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';

type ClinicalSignOwnProps = {
  clinical?: HybridPatientClinical;
  prescriptionConfig?: TFormConfig;
};

async function handleHpoSearchTerm(
  term: string | undefined,
  setCurrentOptions: Dispatch<SetStateAction<IHpoNode[]>>,
) {
  if (!term) return;
  const { data, error } = await HpoApi.searchHpos(term.toLowerCase().trim());
  if (!error) setCurrentOptions((prevList) => [...prevList, map(data?.hits, '_source')[0] || {}]);
}

export const ClinicalSign = ({
  clinical = { signs: [], comment: '' },
  prescriptionConfig,
}: ClinicalSignOwnProps) => {
  const [hpoList, setHpoList] = useState<IHpoNode[]>([]);

  useEffect(() => {
    clinical.signs.forEach((sign) => {
      if (!hpoList.find(({ hpo_id }) => hpo_id === sign.code))
        handleHpoSearchTerm(sign.code, setHpoList);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinical.signs]);

  const positive: HybridPatientSign[] = [];
  const negative: HybridPatientSign[] = [];
  clinical.signs.forEach((sign) => (sign.observed ? positive : negative).push(sign));

  const displayHpo = (code: string, ageCode: string = '') => {
    const hpoInfo = hpoList.find(({ hpo_id }) => hpo_id === code);
    const ageLabel =
      prescriptionConfig?.clinical_signs.onset_age?.find(
        (ageItem: any) => ageItem.value === ageCode,
      )?.name || ageCode;

    return `${hpoInfo?.name || ''} (${code})${ageLabel ? ` - ${ageLabel}` : ''}`;
  };

  return (
    <Descriptions column={1} size="small" className="label-20">
      <Descriptions.Item label={intl.get('screen.prescription.entity.observed')}>
        <Space direction="vertical">
          {positive.length ? positive.map((sign) => displayHpo(sign.code, sign.age_code)) : '--'}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('screen.prescription.entity.not.observed')}>
        <Space direction="vertical">
          {negative.length ? negative.map((sign) => displayHpo(sign.code, sign.age_code)) : '--'}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('screen.prescription.entity.hpo.note')}>
        {clinical.comment || EMPTY_FIELD}
      </Descriptions.Item>
    </Descriptions>
  );
};
