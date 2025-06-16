import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { Descriptions, Space } from 'antd';
import { PhenotypeRequestEntity } from 'api/fhir/models';
import { HpoApi } from 'api/hpo';
import { IHpoNode } from 'api/hpo/models';
import {
  useGeneralObservationEntity,
  useObservationPhenotypeEntity,
  useValueSet,
} from 'graphql/prescriptions/actions';
import { filter, find, map } from 'lodash';

import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { useLang } from 'store/global';

type ClinicalSignOwnProps = {
  phenotypeIds: string[];
  generalObervationIds: string[];
  isProband: boolean;
  isPrenatal?: boolean;
};

type IDOwnProps = {
  ids: string[];
  isProband: boolean;
};

const Observation = ({ ids }: IDOwnProps) => {
  const { generalObervationValue } = useGeneralObservationEntity(ids);
  return <>{generalObervationValue?.valueString}</>;
};

const handleHpoSearchTerm = (
  term: string,
  setCurrentOptions: Dispatch<SetStateAction<IHpoNode[]>>,
) => {
  term
    ? HpoApi.searchHpos(term.toLowerCase().trim()).then(({ data, error }) => {
        if (!error) {
          const results = map(data?.hits, '_source');
          setCurrentOptions((prevList) => [...prevList, results[0] || {}]);
        }
      })
    : null;
};

export const ClinicalSign = ({
  phenotypeIds,
  generalObervationIds,
  isProband,
  isPrenatal,
}: ClinicalSignOwnProps) => {
  const [hpoList, setHpoList] = useState<IHpoNode[]>([]);
  const [ageList, setAgeList] = useState<IHpoNode[]>([
    {
      hpo_id: 'unknown',
      name: 'Unknown',
      is_leaf: false,
      parents: [],
    },
  ]);
  const { phenotypeValue } = useObservationPhenotypeEntity(phenotypeIds);
  const { valueSet } = useValueSet('age-at-onset');
  const lang = useLang();

  const getHpoValue = (element: PhenotypeRequestEntity) => {
    handleHpoSearchTerm(element.valueCodeableConcept?.coding?.code, setHpoList);
    element.extension ? handleHpoSearchTerm(element.extension.valueCoding?.code, setAgeList) : null;
  };

  const workingPhenotypeValue =
    isPrenatal && Array.isArray(phenotypeValue)
      ? phenotypeValue?.filter((p: PhenotypeRequestEntity) => (isProband ? p.focus : !p.focus))
      : phenotypeValue;

  useEffect(() => {
    if (phenotypeValue) {
      if (Array.isArray(phenotypeValue)) {
        phenotypeValue.forEach((element: PhenotypeRequestEntity) => {
          getHpoValue(element);
        });
      } else {
        getHpoValue(phenotypeValue);
      }
    }
  }, [phenotypeValue]);

  let positive = [];
  let negative = [];
  if (Array.isArray(workingPhenotypeValue)) {
    positive = filter(workingPhenotypeValue, (o) => o?.interpretation?.coding?.code === 'POS');
    negative = filter(workingPhenotypeValue, (o) => o?.interpretation?.coding?.code === 'NEG');
  } else {
    positive = [workingPhenotypeValue];
  }

  const displayHpo = (hpoValue: string, age: string = '') => {
    const hpoInfo = find(hpoList, (h: IHpoNode) => h.hpo_id === hpoValue);
    const ageInfo = find(ageList, (h: IHpoNode) => h.hpo_id === age);
    const ageValue = find(valueSet?.concept, (o) => o.code === ageInfo?.hpo_id);
    const ageDisplay = ageValue
      ? ` - ${
          find(ageValue?.designation, (o) => o.language === lang)
            ? find(ageValue?.designation, (o) => o.language === lang)?.value
            : ageValue.display
        }`
      : ` - ${ageInfo?.name}`;

    return `${hpoInfo ? hpoInfo.name : ''} (${hpoValue})${ageInfo ? ageDisplay : ''}`;
  };

  return (
    <Descriptions column={1} size="small" className="label-20">
      <Descriptions.Item label={intl.get('screen.prescription.entity.observed')}>
        <Space direction="vertical">
          {positive.map((p: PhenotypeRequestEntity) =>
            displayHpo(p?.valueCodeableConcept?.coding.code, p?.extension?.valueCoding.code),
          )}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('screen.prescription.entity.not.observed')}>
        {' '}
        <Space direction="vertical">
          {negative.length > 0
            ? negative.map((p: PhenotypeRequestEntity) =>
                displayHpo(p?.valueCodeableConcept?.coding.code),
              )
            : EMPTY_FIELD}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('screen.prescription.entity.hpo.note')}>
        {generalObervationIds?.length > 0 ? (
          <Observation ids={generalObervationIds} isProband={isProband} />
        ) : (
          EMPTY_FIELD
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};
